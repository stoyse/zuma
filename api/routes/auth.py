from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse # Import JSONResponse
from typing import Optional

import database.handler.user_handler as user_handler
import database.handler.organisation_handler as organisation_handler
import database.handler.enterprise_lead_handler as enterprise_lead_handler # Hinzugefügt
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
            organisation_slug = user_check[2]
            organisation_data = organisation_handler.get_organisation_by_slug(organisation_slug)
            organisation = organisation_data.get("organisation", {}).get("name") if organisation_data.get("status") == "success" else None
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

@router.post("/create/organisation")
def create_organisation(data: dict):
    org_name = data.get("name")
    owner_email = data.get("email")
    plan = data.get("plan")

    phone = data.get("phone")
    address = data.get("address")
    website = data.get("website")
    payment_method = data.get("payment_method")
    
    if not org_name or not owner_email or not plan:
        raise HTTPException(status_code=400, detail="Organisation name, owner email, and plan are required.")

    try:
        print(f"Attempting to create organisation with data: {{name: {org_name}, email: {owner_email}, plan: {plan}, payment_method: {payment_method}}}")
        result = organisation_handler.create_organisation(
            name=org_name, 
            email=owner_email, 
            plan=plan,
            phone=phone,
            address=address,
            website=website,
            payment_method=payment_method
        )
        print(f"Organisation creation handler result: {result}")

        if result and result.get("status") == "success":
            try:
                org_id = result.get("organisation_id")
                usr_id = result.get("user_id")
                
                if org_id is None or usr_id is None:
                    error_detail = f"Handler reported success but returned None for org_id ({org_id}) or user_id ({usr_id})."
                    print(f"INTERNAL ERROR in /create/organisation: {error_detail}")
                    raise HTTPException(status_code=500, detail=f"INCONSISTENCY: {error_detail}")

                response_payload = {
                    "status": "success",
                    "message": "Organisation created successfully.",
                    "organisation_id": org_id,
                    "user_id": usr_id
                }
                print(f"Successfully prepared response for /create/organisation: {response_payload}")
                return JSONResponse(content=response_payload, status_code=200) # Explicitly use JSONResponse
            except HTTPException: # Re-raise HTTPExceptions from the checks above
                raise
            except Exception as inner_e:
                print(f"ERROR constructing success response in /create/organisation: {inner_e}")
                raise HTTPException(status_code=500, detail=f"Internal error during response construction: {str(inner_e)}")
        else:
            detail_msg = "Failed to create organisation in database (handler did not report success)."
            if result and result.get("message"):
                detail_msg = result.get("message")
            elif not result:
                detail_msg = "Failed to create organisation (handler returned no result)."
            print(f"Handler did not report success for /create/organisation: {detail_msg}")
            raise HTTPException(status_code=500, detail=detail_msg)

    except HTTPException: # Re-raise HTTPExceptions from initial checks or explicitly raised ones
        raise
    except Exception as e:
        print(f"Generic error in /create/organisation endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected generic internal error occurred: {str(e)}")

@router.post("/enterprise-lead")
def create_enterprise_lead_route(data: dict):
    org_name = data.get("organisation_name")
    contact_email = data.get("contact_email")
    phone = data.get("phone")
    address = data.get("address")
    website = data.get("website")
    notes = data.get("notes") # Optional, falls Sie Notizen vom Frontend senden möchten

    if not org_name or not contact_email:
        raise HTTPException(status_code=400, detail="Organisation name and contact email are required for enterprise leads.")

    try:
        result = enterprise_lead_handler.create_enterprise_lead(
            organisation_name=org_name,
            contact_email=contact_email,
            phone=phone,
            address=address,
            website=website,
            notes=notes
        )

        if result and result.get("status") == "success":
            return JSONResponse(content=result, status_code=201) # 201 Created
        else:
            detail_msg = result.get("message", "Failed to create enterprise lead.")
            raise HTTPException(status_code=500, detail=detail_msg)
            
    except Exception as e:
        print(f"Error in /enterprise-lead endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")