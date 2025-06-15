from fastapi import APIRouter

import database.handler.user_handler as user_handler
import utils.generate_sso as generate_sso
import utils.auth_mail_sender as auth_mail_sender

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/user/login")
def login_user(data: dict):
    email = data.get("email")

    if email:
        user_check = user_handler.check_user(email)
        if user_check:
            login_token = generate_sso.generate_sso_token()
            token = generate_sso.generate_token()
            name = user_check[0]
            userid = user_check[1]
            organisation = user_check[2]
            auth_mail_sender.send_html_email(
                recipient_email=email,
                name=name,
                organisation=organisation,
                code=login_token
            )
            return {"status": "success", "login_token": login_token, "userid": userid, "organisation": organisation, "token": token, "name": name}
            

@router.post("/user/validate")
def validate_user(data: dict):
    userid = data.get("userid")
    email = data.get("email")
    
    if userid and email:
        user_handler.insert_connection(userid)
        return {"status": "success"}, 200
    else:
        return {"status": "failure"}, 400