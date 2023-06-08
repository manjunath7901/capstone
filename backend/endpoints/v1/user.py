from fastapi import APIRouter,HTTPException,Request,UploadFile,File,Form
from model import UserData
from config.mongodb_conn import collection1
from services.userdata import create_userdata,fetch_one_userdata
from pymongo.errors import DuplicateKeyError
from typing import Dict
import requests
import endpoints.v1.images

from compreface import CompreFace
from compreface.service import RecognitionService
from compreface.collections import FaceCollection
from compreface.collections.face_collections import Subjects

DOMAIN: str = 'http://localhost'
PORT: str = '8000'
API_KEY: str = 'f33b09ae-6ce9-45c9-a789-b0a062982c79'

compre_face: CompreFace = CompreFace(DOMAIN, PORT)

recognition: RecognitionService = compre_face.init_face_recognition(API_KEY)

face_collection: FaceCollection = recognition.get_face_collection()

subjects: Subjects = recognition.get_subjects()

router = APIRouter()

@router.post('/adduser') 
async def create_user(file: UploadFile = File(...), name: str = Form(...), email: str = Form(...), password: str = Form(...), dob: str = Form(...)):
    
    existing_user = await collection1.find_one({'email': email}, {'_id': 0})
    if existing_user:
        return {"status":False}
    result = await collection1.insert_one({"name": name, "email": email, "password": password,"dob": dob})

    # Read the uploaded image
    image_data = await file.read()
    print(name,email)

    # with open("/images/img1.jpg", "wd")
    # Save the image as JPEG in the "images" folder
    image_path = f"E:/manjunathcode/capstone/backend/endpoints/v1/images/{str(result.inserted_id)}.jpg"
    with open(image_path, "wb") as image_file:
        image_file.write(image_data)
    
    image_path: str = image_path
    subject: str = str(result.inserted_id)

    face_collection.add(image_path=image_path, subject=subject)

    return {"status":True}

@router.get('/users')
async def get_all_users():
    users = await collection1.find({}, {'name': 1, 'email': 1}).to_list(length=None)
    for user in users:
        user['_id'] = str(user['_id'])
    return users

@router.post("/login")
async def verify_login(file: UploadFile = File(...), email: str = Form(...), password: str = Form(...)):

    details = await fetch_one_userdata(email)
    if not details:
        return {"status": "email"}
    # face authentication
    # Read the uploaded image
    image_data = await file.read()
    print(email)

    # Save the image as JPEG in the "images" folder
    image_path = f"E:/manjunathcode/capstone/backend/endpoints/v1/images/authenticatable.jpg"
    with open(image_path, "wb") as image_file:
        image_file.write(image_data)

    face_response = recognition.recognize(image_path=image_path,  options={
    "limit": 0,
    "det_prob_threshold": 0.95,
    "prediction_count": 1,
    "face_plugins": "calculator,age,gender,landmarks",
    "status": "true"
})
    print(face_response["result"][0]["subjects"])
    if details:
        if password == details['password']:

            if face_response["result"][0]["subjects"][0]["subject"] == str(details["_id"]) and face_response["result"][0]["subjects"][0]["similarity"] > 0.95:
                logged_user_id = str(details["_id"])+"+"+details["dob"]
                
                with open('E:/manjunathcode/capstone/backend/endpoints/v1/signature_data.txt', 'wb') as f:
                    f.write(logged_user_id.encode("utf-8"))

                return {"email": details['email'], "status": "success", "name": details['name']}
            else:
                return {"status": "face"}
        else:
            return {"status": "password"}

# @router.post("/login")
# async def verify_login(request: Request):
#     request = await request.json()
#     details = await fetch_one_userdata(request['email'])
#     if details:
#         if request['password'] == details['password']:
#             logged_user_id = str(details["_id"])+"+"+details["dob"]
            
#             with open('E:/manjunathcode/capstone/backend/endpoints/v1/signature_data.txt', 'wb') as f:
#                 f.write(logged_user_id.encode("utf-8"))

#             return {"email": details['email'], "status": True, "name": details['name']}
#         else:
#             return {"status": False}