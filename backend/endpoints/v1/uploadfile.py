
from config.mongodb_conn import collection2
from fastapi import APIRouter,HTTPException,Request, UploadFile,File

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