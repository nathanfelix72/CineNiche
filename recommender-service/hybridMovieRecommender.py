import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sqlite3

# Connect to SQLite and load tables
conn = sqlite3.connect("../Backend/CineNiche/CineNiche/Movies.sqlite") 
df_ratings = pd.read_sql_query("SELECT * FROM movies_ratings", conn)
df_titles = pd.read_sql_query("SELECT * FROM movies_titles", conn)
conn.close()

# Rename and clean up
df_titles.rename(columns={'rating': 'mpaa_rating'}, inplace=True)
df_titles.fillna({
    'director': 'Unknown',
    'cast': 'Unknown',
    'country': '',
    'mpaa_rating': 'Not Rated'
}, inplace=True)
df_titles.loc[df_titles['duration'].isnull(), 'duration'] = "74 min"

# Build genre tags
genre_cols = [
    'Action', 'Adventure', 'Anime Series International TV Shows',
    'British TV Shows Docuseries International TV Shows', 'Children', 'Comedies',
    'Comedies Dramas International Movies', 'Comedies International Movies',
    'Comedies Romantic Movies', 'Crime TV Shows Docuseries', 'Documentaries',
    'Documentaries International Movies', 'Docuseries', 'Dramas',
    'Dramas International Movies', 'Dramas Romantic Movies', 'Family Movies',
    'Fantasy', 'Horror Movies', 'International Movies Thrillers',
    'International TV Shows Romantic TV Shows TV Dramas', "Kids' TV",
    'Language TV Shows', 'Musicals', 'Nature TV', 'Reality TV', 'Spirituality',
    'TV Action', 'TV Comedies', 'TV Dramas', 'Talk Shows TV Comedies', 'Thrillers'
]
df_titles['genre_tags'] = df_titles[genre_cols].apply(
    lambda row: ' '.join([col for col in genre_cols if row.get(col)]),
    axis=1
)

# Clean & merge
df_titles = df_titles.drop_duplicates()
df_ratings = df_ratings.drop_duplicates()


# merge tables
df_movies = df_ratings.merge(df_titles, on='show_id')

# TF-IDF modeling
df_titles['tfidf_text'] = df_titles['type'] + ' ' + df_titles['genre_tags'] + ' ' + df_titles['description']
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df_titles['tfidf_text'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
indices = pd.Series(df_titles.index, index=df_titles['title']).drop_duplicates()

# Average rating
avg_ratings = df_movies.groupby('title')['rating'].mean()

# Main recommendation function
def get_hybrid_recommendations(title, n=5, min_rating=3.5, use_genre_bonus=True):
    idx = indices.get(title)
    if idx is None:
        return []

    input_country = df_titles.loc[idx, 'country']
    input_rating = df_titles.loc[idx, 'mpaa_rating']
    input_genres = set(df_titles.loc[idx, 'genre_tags'].split())

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:]

    scored_recs = []
    for i, score in sim_scores:
        candidate = df_titles.iloc[i]
        title_c = candidate['title']
        country_c = candidate['country']
        rating_c = candidate['mpaa_rating']
        candidate_genres = set(candidate['genre_tags'].split())

        if title_c in avg_ratings and avg_ratings[title_c] >= min_rating:
            bonus = 0
            if input_country == country_c:
                bonus += 0.1
            elif pd.isna(input_country) or pd.isna(country_c):
                bonus += 0.05

            if input_rating == rating_c:
                bonus += 0.1
            elif pd.isna(input_rating) or pd.isna(rating_c):
                bonus += 0.05

            if use_genre_bonus and (input_genres & candidate_genres):
                bonus += 0.1

            final_score = score + bonus
            scored_recs.append((title_c, final_score))

    # Sort once after collecting all recommendations
    scored_recs = sorted(scored_recs, key=lambda x: x[1], reverse=True)

    results = []
    seen_titles = set()
    for title, _ in scored_recs:
        if title not in seen_titles:
            seen_titles.add(title)
            show_id = df_titles[df_titles['title'] == title]['show_id'].values
            if len(show_id) > 0:
                results.append({'id': int(show_id[0]), 'title': title})
        if len(results) >= n:
            break

    return results

# API wrapper function
def get_recommendations_for_title(title: str, count: int = 10):
    return get_hybrid_recommendations(title, n=count)