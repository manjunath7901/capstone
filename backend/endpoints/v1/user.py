from fastapi import APIRouter,HTTPException,Request
from model import UserData
from config.mongodb_conn import collection1
from services.userdata import create_userdata,fetch_one_userdata
from pymongo.errors import DuplicateKeyError
from typing import Dict

router = APIRouter()

@router.post('/adduser')
async def create_user(userdata: dict):
    existing_user = await collection1.find_one({'email': userdata['email']}, {'_id': 0})
    if existing_user:
        return {"status":False}
    user_dict = userdata
    result = await collection1.insert_one(user_dict)
    return {"status":True}


@router.get('/users')
async def get_all_users():
    users = await collection1.find({}, {'name': 1, 'email': 1}).to_list(length=None)
    for user in users:
        user['_id'] = str(user['_id'])
    return users


@router.post("/login")
async def verify_login(request: Request):
    request = await request.json()
    details = await fetch_one_userdata(request['email'])
    if details:
        if request['password'] == details['password']:
            return {"email": details['email'], "status": True, "name": details['name']}
        else:
            return {"status": False}