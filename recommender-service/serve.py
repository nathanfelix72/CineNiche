# serve.py
from fastapi import FastAPI, Query
from hybridMovieRecommender import get_hybrid_recommendations
from userMovieRecommender import get_user_homepage_recommendations
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


app = FastAPI()

# ✅ Must come right after app creation and before any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://black-flower-0d9471f1e.6.azurestaticapps.net"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "UP"}

@app.get("/recommend")
def recommend(title: str = Query(...), count: int = 5):
    return {"recommended": get_hybrid_recommendations(title, n=count)}

@app.get("/user-recs")
def user_recs(user_id: int = Query(...)):
    return get_user_homepage_recommendations(user_id)


@app.get("/test-cors")
def test():
    from fastapi.responses import JSONResponse
    response = JSONResponse(content={"message": "Test passed"})
    print("🚨 Response headers:", response.headers)
    return response