# app.py
# This file sets up a FastAPI web server to expose your two movie recommenders as RESTful endpoints.

from fastapi import FastAPI, Query

# Import the actual recommender functions from your other Python files
from hybridMovieRecommender import get_hybrid_recommendations  # movie-based recommender
from userMovieRecommender import get_user_homepage_recommendations  # user-based homepage recs

# Create the FastAPI app
app = FastAPI()

# --------------------------
# Endpoint 1: Recommend by movie title (content-based)
# --------------------------
@app.get("/recommend")
def recommend(title: str = Query(..., description="The movie title to base recommendations on"),
              count: int = Query(5, description="How many recommendations to return")):
    
    # Returns a list of recommended movies based on a given movie title.
    # Example: /recommend?title=Inception&count=5
    
    results = get_hybrid_recommendations(title, n=count)
    return {"recommended": results}


# --------------------------
# Endpoint 2: Recommend by user ID (collaborative filtering + genre)
# --------------------------
@app.get("/user-recs")
def user_recommendations(user_id: int = Query(..., description="User ID for personalized homepage recommendations")):
    # Returns personalized recommendation sections for a user's homepage.
    # Includes Top Picks, Favorite Genres, and Shake It Up recommendations.
    # Example: /user-recs?user_id=8

    results = get_user_homepage_recommendations(user_id)
    return results