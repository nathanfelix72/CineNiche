import pandas as pd
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from surprise import SVD, Dataset, Reader

# === Load and prepare data ===
import sqlite3

conn = sqlite3.connect("/Users/amysessions/Desktop/INTEX2/CineNiche/Backend/CineNiche/CineNiche/Movies.sqlite")  
df_ratings = pd.read_sql_query("SELECT * FROM movies_ratings", conn)
df_titles = pd.read_sql_query("SELECT * FROM movies_titles", conn)
df_users  = pd.read_sql_query("SELECT * FROM movies_users", conn)  
conn.close()

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

# === Recommender helper functions ===

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
        (row['title'], svd_model.predict(user_id, row['title']).est)
        for _, row in genre_pool.iterrows()
    ]
    predictions = sorted(predictions, key=lambda x: x[1], reverse=True)
    return [title for title, _ in predictions[:n]]

def get_shake_it_up(user_id, n=5):
    fav_genres = get_user_top_genres(user_id)
    genre_pool = df_movies[
        (~df_movies['genre_tags'].apply(lambda g: any(fav in g for fav in fav_genres)))
    ]
    user_seen = df_movies[df_movies['user_id'] == user_id]['title'].unique()
    genre_pool = genre_pool[~genre_pool['title'].isin(user_seen)]
    predictions = [
        (row['title'], svd_model.predict(user_id, row['title']).est)
        for _, row in genre_pool.iterrows()
    ]
    predictions = sorted(predictions, key=lambda x: x[1], reverse=True)
    return list(dict.fromkeys([title for title, _ in predictions[:n]]))

def get_collaborative_recommendations(user_id, n=5):
    user_seen = df_movies[df_movies['user_id'] == user_id]['title'].unique()
    unseen_movies = df_movies[~df_movies['title'].isin(user_seen)]['title'].unique()
    predictions = [
        (title, svd_model.predict(user_id, title).est)
        for title in unseen_movies
    ]
    predictions = sorted(predictions, key=lambda x: x[1], reverse=True)
    return [title for title, _ in predictions[:n]]

def clean_genre_label(genre):
    return genre.replace("Movies", "").replace("TV Shows", "").strip()

# === Main API-Callable Function ===
def get_user_homepage_recommendations(user_id):
    fav_genres = get_user_top_genres(user_id)
    top_picks = get_collaborative_recommendations(user_id, n=10)
    genre_1_recs = get_genre_recommendations(user_id, fav_genres[0], n=10)
    genre_2_recs = get_genre_recommendations(user_id, fav_genres[1], n=10)
    shake_it_up_recs = get_shake_it_up(user_id, n=10)

    # Remove overlap
    shake_it_up_unique = [movie for movie in shake_it_up_recs if movie not in genre_1_recs and movie not in genre_2_recs]
    all_other_recs = top_picks + genre_1_recs + genre_2_recs
    unique_recs = list(set(all_other_recs))
    random.seed(42)
    random.shuffle(shake_it_up_unique)

    return {
        'Top Picks': unique_recs[:10],
        f'{clean_genre_label(fav_genres[0])} For You': unique_recs[10:20],
        f'{clean_genre_label(fav_genres[1])} For You': unique_recs[20:30],
        'Switch It Up!': shake_it_up_unique[:10]
    }