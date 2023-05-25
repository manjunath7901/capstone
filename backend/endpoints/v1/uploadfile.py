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
import requests
from endpoints.v1.signature_encryption import encrypt_signature
import base64
from tkinter import Tk
from tkinter.filedialog import askdirectory

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
    encrypted_content = base64.b64encode(encrypted_content).decode('utf-8')  # Encode bytes to Base64
    authorized_users_array = json.loads(authorized_users)  # Parse the JSON string to a list

    url = "http://23.21.228.145:80/upload"
    with open("E:/manjunathcode/capstone/backend/endpoints/v1/signature_data.txt", "rb") as f:
        logged_user_id = f.read()
        print(logged_user_id)
        logged_user_id = logged_user_id.decode("utf-8")


    signature = encrypt_signature(logged_user_id)
    print(signature)
    header = {"Content-Type": "application/json","Signature": signature}
    data = {"filename": file.filename, "content": encrypted_content, "authorized_users": authorized_users_array}

    response = requests.post(url, headers=header, json=data)

    if response.status_code == 200:
        cloud_response = response.json()
        print(response.json())
    else:
        return {"error": "no response form server2"}
    
    print(response)
    return {"file_id": str(cloud_response["file_id"])}

@router.get("/files")
async def get_file_list(email: str):
    # user = await collection1.find_one({"email": email})
    # user_id = str(user["_id"]) if user else None

    url = "http://23.21.228.145:80/getfiles"
    with open("E:/manjunathcode/capstone/backend/endpoints/v1/signature_data.txt", "rb") as f:
        logged_user_id = f.read()
        print(logged_user_id)
        logged_user_id = logged_user_id.decode("utf-8")

    signature = encrypt_signature(logged_user_id)
    header = {"Content-Type": "application/json","Signature": signature}

    response = requests.post(url, headers=header)

    if response.status_code == 200:
        cloud_response = response.json()
        print(response.json())
        serialized_files =cloud_response["files"]
    else:
        return {"error": "no response form server2"}


    return {"files": serialized_files}


@router.get("/file/{file_id}")
async def get_file(file_id: str):

    url = "http://23.21.228.145:80/getfile"
    with open("E:/manjunathcode/capstone/backend/endpoints/v1/signature_data.txt", "rb") as f:
        logged_user_id = f.read()
        print(logged_user_id)
        logged_user_id = logged_user_id.decode("utf-8")

    signature = encrypt_signature(logged_user_id+'+'+file_id)
    header = {"Content-Type": "application/json","Signature": signature}

    response = requests.post(url, headers=header)

    if response.status_code == 200:
        cloud_response = response.json()
        print(response.json())
    else:
        return {"error": "no response form server2"}

    decrypted_content = decrypt_content(base64.b64decode(cloud_response["content"]))
    return {"content": decrypted_content}

@router.delete("/delete/{file_id}")
async def delete_file(file_id: str):
    print("ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
    url = "http://23.21.228.145:80/delete"
    with open("E:/manjunathcode/capstone/backend/endpoints/v1/signature_data.txt", "rb") as f:
        logged_user_id = f.read()
        print(logged_user_id)
        logged_user_id = logged_user_id.decode("utf-8")

    signature = encrypt_signature(logged_user_id+'+'+file_id)
    header = {"Content-Type": "application/json","Signature": signature}

    response = requests.post(url, headers=header)

    if response.status_code == 200:
        cloud_response = response.json()
        print(response.json())
    else:
        return {"error": "no response form server2"}

    return {"message": cloud_response["status"]}

# @router.get("/download/{file_id}")
# async def download_file(file_id: str):

#     url = "http://23.21.228.145:80/getfile"
#     with open("E:/manjunathcode/capstone/backend/endpoints/v1/signature_data.txt", "rb") as f:
#         logged_user_id = f.read()
#         print(logged_user_id)
#         logged_user_id = logged_user_id.decode("utf-8")

#     signature = encrypt_signature(logged_user_id+'+'+file_id)
#     header = {"Content-Type": "application/json","Signature": signature}

#     response = requests.post(url, headers=header)
#     print("ssssssssssssssssssssssssssssssssssssssssssssss")
#     if response.status_code == 200:
#         cloud_response = response.json()
#         print(response.json())
#     else:
#         return {"error": "no response form server2"}

#     decrypted_content = decrypt_content(base64.b64decode(cloud_response["content"]))
#     # Create a Tkinter root window
#     root = Tk()
#     root.withdraw()
#     # Prompt the user to select a directory
#     selected_directory = askdirectory(title="Select Destination Folder")
#     # If the user cancels the folder selection, exit the program
#     if not selected_directory:
#         exit()
#     # Create the destination path
#     destination = selected_directory + "/"+cloud_response["filename"]
#     # Download the file
#     with open(destination, "wb") as file:
#         file.write(decrypted_content.encode("utf-8"))


#     return {"status": "downloaded"}


@router.get('/get_id')
async def get_id_by_email(email:str):
    print(email)
    user = await collection1.find_one({"email": email})
    user_id = str(user["_id"]) if user else None
    return {"user_id": user_id}
    
    