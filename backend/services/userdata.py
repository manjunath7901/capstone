from config.mongodb_conn import collection1
from model import UserData
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException

async def create_userdata(userdata: UserData):
    existing_user = await collection1.find_one({'email': userdata.email})
    if existing_user:
        raise HTTPException(400, 'User with this email already exists')

    result = await collection1.insert_one(userdata.dict())
    userdata.id = result.inserted_id
    return userdata

async def fetch_one_userdata(email):
    document = await collection1.find_one({"email": email})
    return document

