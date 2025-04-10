# serve.py
from fastapi import FastAPI, Query
from hybridMovieRecommender import get_hybrid_recommendations
from userMovieRecommender import get_user_homepage_recommendations

app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "UP"}

@app.get("/recommend")
def recommend(title: str = Query(...), count: int = 5):
    return {"recommended": get_hybrid_recommendations(title, n=count)}

@app.get("/user-recs")
def user_recs(user_id: int = Query(...)):
    return get_user_homepage_recommendations(user_id)