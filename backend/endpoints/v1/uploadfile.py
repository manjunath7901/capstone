
# # from config.mongodb_conn import collection2
# # from fastapi import APIRouter,HTTPException,Request, UploadFile,File
# # from bson import ObjectId
# # from fastapi.encoders import jsonable_encoder

# # router = APIRouter()

# # @router.post("/upload")
# # async def upload_file(file: UploadFile = File(...)):
# #     content = await file.read()

# #     file_dict = {
# #         "filename": file.filename,
# #         "content": content.decode("utf-8")  # Assuming the file is text-based
# #     }

# #     result = await collection2.insert_one(file_dict)
# #     return {"file_id": str(result.inserted_id)}

# # # @router.get("/files")
# # # async def get_file_list():
# # #     files = await collection2.find().to_list(length=None)
# # #     return {"files": files}

# # # @router.get("/file/{file_id}")
# # # async def get_file(file_id: str):
# # #     result = await collection2.find_one({"_id": ObjectId(file_id)})
# # #     if result is None:
# # #         raise HTTPException(status_code=404, detail="File not found")
# # #     return {"content": result["content"]}

# # @router.get("/files")
# # async def get_file_list():
# #     files = await collection2.find().to_list(length=None)
# #     serialized_files = []
# #     for file in files:
# #         serialized_file = jsonable_encoder(file)
# #         serialized_file["_id"] = str(serialized_file["_id"])  # Convert ObjectId to string
# #         serialized_files.append(serialized_file)
# #     return {"files": serialized_files}

# # @router.get("/file/{file_id}")
# # async def get_file(file_id: str):
# #     result = await collection2.find_one({"_id": ObjectId(file_id)})
# #     if result is None:
# #         raise HTTPException(status_code=404, detail="File not found")
# #     serialized_result = jsonable_encoder(result)
# #     serialized_result["_id"] = str(serialized_result["_id"])  # Convert ObjectId to string
# #     return {"content": serialized_result["content"]}

# from config.mongodb_conn import collection2
# from fastapi import APIRouter, HTTPException,UploadFile,File
# from bson import ObjectId
# from typing import List
# from fastapi import Form
# import json

# router = APIRouter()


# import json

# @router.post("/upload")
# async def upload_file(file: UploadFile = File(...), authorized_users: str = Form(...)):
#     content = await file.read()
#     authorized_users_array = json.loads(authorized_users)  # Parse the JSON string to a list
#     file_dict = {
#         "filename": file.filename,
#         "content": content.decode("utf-8"),  # Assuming the file is text-based
#         "authorized_users": authorized_users_array
#     }
#     result = await collection2.insert_one(file_dict)
#     return {"file_id": str(result.inserted_id)}


# @router.get("/files")
# async def get_file_list():
#     files = await collection2.find().to_list(length=None)
#     serialized_files = []
#     for file in files:
#         serialized_file = {
#             "filename": file["filename"],
#             "file_id": str(file["_id"])
#         }
#         serialized_files.append(serialized_file)
#     return {"files": serialized_files}


# @router.get("/file/{file_id}")
# async def get_file(file_id: str):
#     result = await collection2.find_one({"_id": ObjectId(file_id)})
#     if result is None:
#         raise HTTPException(status_code=404, detail="File not found")
#     return {"content": result["content"]}

from config.mongodb_conn import collection2,collection1
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from bson import ObjectId
from typing import List
from fastapi import Form,Request
import json
from cryptography.fernet import Fernet


router = APIRouter()

# Load or generate the encryption key
key_file = "encryption_key.txt"
try:
    with open(key_file, "rb") as file:
        key = file.read()
except FileNotFoundError:
    key = Fernet.generate_key()
    with open(key_file, "wb") as file:
        file.write(key)

cipher_suite = Fernet(key)

def encrypt_content(content: str) -> bytes:
    return cipher_suite.encrypt(content.encode("utf-8"))

def decrypt_content(content: bytes) -> str:
    return cipher_suite.decrypt(content).decode("utf-8")

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), authorized_users: str = Form(...)):
    content = await file.read()
    encrypted_content = encrypt_content(content.decode("utf-8"))
    authorized_users_array = json.loads(authorized_users)  # Parse the JSON string to a list
    file_dict = {
        "filename": file.filename,
        "content": encrypted_content,
        "authorized_users": authorized_users_array
    }
    result = await collection2.insert_one(file_dict)
    return {"file_id": str(result.inserted_id)}

@router.get("/files")
async def get_file_list(email: str):
    
    user = await collection1.find_one({"email": email})
    user_id = str(user["_id"]) if user else None
    files = await collection2.find().to_list(length=None)
    serialized_files = []
    for file in files:
        authorized_users = file["authorized_users"]
        if user_id in authorized_users:
            serialized_file = {
                "filename": file["filename"],
                "file_id": str(file["_id"])
            }
            serialized_files.append(serialized_file)
    return {"files": serialized_files}


@router.get("/file/{file_id}")
async def get_file(file_id: str):
    result = await collection2.find_one({"_id": ObjectId(file_id)})
    if result is None:
        raise HTTPException(status_code=404, detail="File not found")
    decrypted_content = decrypt_content(result["content"])
    return {"content": decrypted_content}


@router.get('/get_id')
async def get_id_by_email(email:str):
    print(email)
    user = await collection1.find_one({"email": email})
    user_id = str(user["_id"]) if user else None
    return {"user_id": user_id}
    
    