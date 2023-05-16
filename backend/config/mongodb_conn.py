import motor.motor_asyncio
from gridfs import GridFS


client = motor.motor_asyncio.AsyncIOMotorClient(
    'mongodb://localhost:27017/')

database = client.capstone
collection1 = database.userdata