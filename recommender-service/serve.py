# serve.py
from fastapi import FastAPI, Query
from hybridMovieRecommender import get_hybrid_recommendations
from userMovieRecommender import get_user_homepage_recommendations
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://black-flower-0d9471f1e.6.azurestaticapps.net"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

@app.options("/{rest_of_path:path}")
def preflight_handler():
    return JSONResponse(content={"message": "CORS preflight success"})

@app.get("/test-cors")
def test():
    from fastapi.responses import JSONResponse
    response = JSONResponse(content={"message": "Test passed"})
    print("🚨 Response headers:", response.headers)
    return response