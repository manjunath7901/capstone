from fastapi import APIRouter,HTTPException
from endpoints.v1.user import router as user_router



router = APIRouter()
router.include_router(user_router,tags=["user endpoints"])


