
# from config.mongodb_conn import collection2
# from fastapi import APIRouter,HTTPException,Request, UploadFile,File
# from bson import ObjectId
# from fastapi.encoders import jsonable_encoder

# router = APIRouter()

# @router.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     content = await file.read()

#     file_dict = {
#         "filename": file.filename,
#         "content": content.decode("utf-8")  # Assuming the file is text-based
#     }

#     result = await collection2.insert_one(file_dict)
#     return {"file_id": str(result.inserted_id)}

# # @router.get("/files")
# # async def get_file_list():
# #     files = await collection2.find().to_list(length=None)
# #     return {"files": files}

# # @router.get("/file/{file_id}")
# # async def get_file(file_id: str):
# #     result = await collection2.find_one({"_id": ObjectId(file_id)})
# #     if result is None:
# #         raise HTTPException(status_code=404, detail="File not found")
# #     return {"content": result["content"]}

# @router.get("/files")
# async def get_file_list():
#     files = await collection2.find().to_list(length=None)
#     serialized_files = []
#     for file in files:
#         serialized_file = jsonable_encoder(file)
#         serialized_file["_id"] = str(serialized_file["_id"])  # Convert ObjectId to string
#         serialized_files.append(serialized_file)
#     return {"files": serialized_files}

# @router.get("/file/{file_id}")
# async def get_file(file_id: str):
#     result = await collection2.find_one({"_id": ObjectId(file_id)})
#     if result is None:
#         raise HTTPException(status_code=404, detail="File not found")
#     serialized_result = jsonable_encoder(result)
#     serialized_result["_id"] = str(serialized_result["_id"])  # Convert ObjectId to string
#     return {"content": serialized_result["content"]}

from config.mongodb_conn import collection2
from fastapi import APIRouter, HTTPException,UploadFile,File
from bson import ObjectId

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()

    file_dict = {
        "filename": file.filename,
        "content": content.decode("utf-8")  # Assuming the file is text-based
    }

    result = await collection2.insert_one(file_dict)
    return {"file_id": str(result.inserted_id)}

@router.get("/files")
async def get_file_list():
    files = await collection2.find().to_list(length=None)
    serialized_files = []
    for file in files:
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
    return {"content": result["content"]}
