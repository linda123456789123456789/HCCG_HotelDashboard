from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SRC_URL = "https://odws.hccg.gov.tw/001/Upload/25/opendataback/9059/276/8b8ac782-570e-4b05-aba1-a6cb69b803ac.json"


@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/api/raw")
def get_raw():
    try:
        resp = requests.get(SRC_URL, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"source fetch error: {e}")
