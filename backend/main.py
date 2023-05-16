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
    
# @app.post("/folders")
# async def create_folder(folder_name: str):
#     folder = {"name": folder_name}
#     await db["folders"].insert_one(folder)
#     return {"message": "Folder created successfully"}

# @app.get("/folders")
# async def get_folders():
#     folders = await db["folders"].find().to_list(length=None)
#     return folders

# @app.post("/folders/{folder_id}/files")
# async def upload_file(folder_id: str, file: UploadFile = File(...)):
#     folder = await db["folders"].find_one({"_id": folder_id})
#     if folder is None:
#         return {"message": "Folder not found"}

#     # Save the file content to MongoDB GridFS
#     file_id = fs.put(file.file, filename=file.filename)

#     # Save the file metadata to the appropriate folder document
#     await db["folders"].update_one(
#         {"_id": folder_id},
#         {"$push": {"files": {"file_id": file_id, "filename": file.filename}}}
#     )

#     return {"message": "File uploaded successfully"}

# @app.get("/folders/{folder_id}/files")
# async def get_folder_files(folder_id: str):
#     folder = await db["folders"].find_one({"_id": folder_id})
#     if folder is None:
#         return {"message": "Folder not found"}

#     return folder["files"]

# @app.get("/files/{file_id}")
# async def get_file(file_id: str):
#     file = fs.get(file_id)
#     if file is None:
#         return {"message": "File not found"}

#     # Return the file content as a response
#     return file.read()
