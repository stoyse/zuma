from fastapi import APIRouter

import database.handler.user_handler as user_handler

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/user/validate")
def validate_user(data: dict):
    userid = data.get("userid")
    email = data.get("email")
    
    if userid and email:
        user_handler.insert_connection(userid)
        return {"status": "success"}, 200
    else:
        return {"status": "failure"}, 400