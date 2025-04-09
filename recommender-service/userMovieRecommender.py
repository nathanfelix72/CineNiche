import pandas as pd
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from surprise import SVD, Dataset, Reader
import sqlite3

# === Load and prepare data ===
conn = sqlite3.connect("../Backend/CineNiche/CineNiche/Movies.sqlite")  
df_ratings = pd.read_sql_query("SELECT * FROM movies_ratings", conn)
df_titles = pd.read_sql_query("SELECT * FROM movies_titles", conn)
df_users  = pd.read_sql_query("SELECT * FROM movies_users", conn)  
conn.close()

title_to_id = df_titles.drop_duplicates(subset='title').set_index('title')['show_id'].to_dict()

# Rename & fill nulls
df_titles.rename(columns={'rating': 'mpaa_rating'}, inplace=True)
df_titles['director'] = df_titles['director'].fillna('Unknown')
df_titles['cast'] = df_titles['cast'].fillna('Unknown')
df_titles['country'] = df_titles['country'].fillna('Unknown')
df_titles['mpaa_rating'] = df_titles['mpaa_rating'].fillna('Not Rated')
df_titles.loc[df_titles['duration'].isnull(), 'duration'] = "74 min"

# Drop unused user columns
cols_to_drop = ['name', 'phone', 'email', 'city', 'state', 'zip']
df_users_cleaned = df_users.drop(columns=cols_to_drop)

# Clean and merge
df_titles = df_titles.drop_duplicates()
df_ratings = df_ratings.dropna().drop_duplicates()
genre_cols = [col for col in df_titles.columns if col not in [
    'show_id', 'type', 'title', 'director', 'cast', 'country', 'release_year',
    'mpaa_rating', 'duration', 'description'
]]
df_titles['genre_tags'] = df_titles[genre_cols].apply(
    lambda row: ' '.join([col for col in genre_cols if row.get(col)]),
    axis=1
)
df_titles['tfidf_text'] = df_titles['type'] + ' ' + df_titles['genre_tags'] + ' ' + df_titles['description']
df_movies = df_ratings.merge(df_titles, on='show_id')
avg_ratings = df_movies.groupby('title')['rating'].mean().to_dict()

# === Collaborative filtering model ===
ratings_data = df_movies[['user_id', 'title', 'rating']]
reader = Reader(rating_scale=(0.5, 5.0))
data = Dataset.load_from_df(ratings_data, reader)
trainset = data.build_full_trainset()
svd_model = SVD()
svd_model.fit(trainset)

# === Helper functions ===

def format_recommendations(movie_list):
    formatted = []
    for movie in movie_list:
        title = movie['title']
        show_id = movie.get('id') or title_to_id.get(title, 0)
        if show_id == 0 or not title:
            print(f"[Warning] Could not find valid ID for title: '{title}'")
        formatted.append({'id': show_id, 'title': title})
    return formatted

def get_user_top_genres(user_id, min_rating=4.0):
    user_rated = df_movies[df_movies['user_id'] == user_id]
    high_rated = user_rated[user_rated['rating'] >= min_rating]
    genre_df = high_rated.assign(genre_list=high_rated['genre_tags'].str.split()).explode('genre_list')
    top_genres = genre_df['genre_list'].value_counts().head(3).index.tolist()
    return top_genres

def get_genre_recommendations(user_id, genre, n=5):
    user_seen = df_movies[df_movies['user_id'] == user_id]['title'].unique()
    genre_pool = df_movies[
        (df_movies['genre_tags'].str.contains(genre)) &
        (~df_movies['title'].isin(user_seen))
    ]
    predictions = [
        (row['show_id'], row['title'], svd_model.predict(user_id, row['title']).est)
        for _, row in genre_pool.iterrows()
    ]
    predictions = sorted(predictions, key=lambda x: x[2], reverse=True)
    return [{'id': show_id, 'title': title} for show_id, title, _ in predictions[:n]]

def get_shake_it_up(user_id, n=5):
    fav_genres = get_user_top_genres(user_id)
    genre_pool = df_movies[
        (~df_movies['genre_tags'].apply(lambda g: any(fav in g for fav in fav_genres)))
    ]
    user_seen = df_movies[df_movies['user_id'] == user_id]['title'].unique()
    genre_pool = genre_pool[~genre_pool['title'].isin(user_seen)]
    predictions = [
        (row['show_id'], row['title'], svd_model.predict(user_id, row['title']).est)
        for _, row in genre_pool.iterrows()
    ]
    predictions = sorted(predictions, key=lambda x: x[2], reverse=True)
    seen_titles = set()
    results = []
    for show_id, title, _ in predictions:
        if title not in seen_titles:
            seen_titles.add(title)
            results.append({'id': show_id, 'title': title})
        if len(results) >= n:
            break
    return results

def get_collaborative_recommendations(user_id, n=5):
    user_seen = df_movies[df_movies['user_id'] == user_id]['title'].unique()
    unseen = df_movies[~df_movies['title'].isin(user_seen)][['show_id', 'title']].drop_duplicates()
    predictions = [
        (row['show_id'], row['title'], svd_model.predict(user_id, row['title']).est)
        for _, row in unseen.iterrows()
    ]
    predictions = sorted(predictions, key=lambda x: x[2], reverse=True)
    return [{'id': show_id, 'title': title} for show_id, title, _ in predictions[:n]]

def clean_genre_label(genre):
    return genre.replace("Movies", "").replace("TV Shows", "").strip()

# === Main Recommendation Function ===
def get_user_homepage_recommendations(user_id):
    fav_genres = get_user_top_genres(user_id)
    top_picks = get_collaborative_recommendations(user_id, n=10)
    genre_1_recs = get_genre_recommendations(user_id, fav_genres[0], n=10)
    genre_2_recs = get_genre_recommendations(user_id, fav_genres[1], n=10)
    shake_it_up_recs = get_shake_it_up(user_id, n=10)

    def filter_duplicates(primary, others):
        seen = set((m['title'] for m in others))
        return [m for m in primary if m['title'] not in seen]

    def clean_results(results):
        return [m for m in results if m['title'] and m['id'] > 0]

    return {
        'Top Picks': format_recommendations(top_picks),
        f'{clean_genre_label(fav_genres[0])} For You': format_recommendations(genre_1_recs),
        
        'Switch It Up!': format_recommendations(filter_duplicates(shake_it_up_recs, genre_1_recs + genre_2_recs + top_picks))
    }
