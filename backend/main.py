from fastapi import FastAPI, HTTPException, Request
from model import UserData


from api_router import router as api_router



# an HTTP-specific exception class  to generate exception information

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "*"
]

# what is a middleware?
# software that acts as a bridge between an operating system or database and applications, especially on a network.

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router,prefix="/api/v1")

@app.get("/")
async def read_root():
    return {"Hello": "World"}

