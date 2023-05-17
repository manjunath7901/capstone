from fastapi import APIRouter,HTTPException
from endpoints.v1.user import router as user_router
from endpoints.v1.uploadfile import router as uploadfile_router



router = APIRouter()
router.include_router(user_router,tags=["user endpoints"])
router.include_router(uploadfile_router,tags=["uploadfile endpoints"])


