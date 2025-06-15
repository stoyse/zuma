from fastapi import APIRouter, HTTPException, Depends, Form
from pydantic import BaseModel
import stripe
import os
import dotenv
# Importiere den neuen Handler
from database.handler.promo_code_handler import get_promo_code_details

dotenv.load_dotenv()  # Lade Umgebungsvariablen aus .env Datei

stripe.api_key = os.getenv("STRIPE_SECRET_KEY") 

router = APIRouter()

class PaymentIntentRequest(BaseModel):
    amount: int # Betrag in der kleinsten Währungseinheit (z.B. Cent)
    currency: str # z.B. "eur" oder "usd"
    payment_method_types: list[str] = ['card'] # Standardmäßig Kartenzahlung

class PaymentIntentResponse(BaseModel):
    clientSecret: str

@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent_route(request_data: PaymentIntentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=request_data.amount,
            currency=request_data.currency,
            payment_method_types=request_data.payment_method_types
            # Du kannst hier weitere Parameter hinzufügen, z.B. Metadaten
            # metadata={'organisation_id': 'org_123'}
        )
        if intent and intent.client_secret:
            return PaymentIntentResponse(clientSecret=intent.client_secret)
        else:
            print(f"Stripe PaymentIntent Erstellung fehlgeschlagen oder client_secret fehlt. Intent: {intent}")
            raise HTTPException(status_code=500, detail="Fehler beim Erstellen des Payment Intents bei Stripe.")
    except stripe.error.StripeError as e:
        print(f"Stripe API Fehler: {str(e)}")
        raise HTTPException(status_code=e.http_status or 500, detail=str(e.user_message or "Ein Stripe API Fehler ist aufgetreten."))
    except Exception as e:
        print(f"Allgemeiner Fehler in /create-payment-intent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ein interner Fehler ist aufgetreten: {str(e)}")

class CheckoutSessionRequest(BaseModel):
    plan_id: str # ID des Preisplans in Stripe (z.B. price_xxxxxx)
    success_url: str # URL, zu der nach erfolgreicher Zahlung weitergeleitet wird
    cancel_url: str # URL, zu der bei Abbruch weitergeleitet wird
    organisation_name: str | None = None # Optional, für Metadaten
    user_email: str | None = None # Optional, für Metadaten oder Vorbelegung
    promo_code: str | None = None # Optional, für Promo-Codes

class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str

@router.post("/create-checkout-session", response_model=CheckoutSessionResponse)
async def create_checkout_session_route(request_data: CheckoutSessionRequest):
    try:
        # Hier könntest du Logik einbauen, um den Preis basierend auf der plan_id zu holen,
        # falls du nicht direkt die Price ID von Stripe übergibst.
        # Für dieses Beispiel gehen wir davon aus, dass plan_id eine gültige Stripe Price ID ist.

        line_items = [
            {
                "price": request_data.plan_id,
                "quantity": 1,
            }
        ]

        # Optionale Metadaten für die Checkout-Sitzung
        metadata = {}
        if request_data.organisation_name:
            metadata['organisation_name'] = request_data.organisation_name
        if request_data.user_email:
            metadata['user_email'] = request_data.user_email
            
        stripe_coupon_id_to_apply = None
        if request_data.promo_code:
            promo_details = get_promo_code_details(request_data.promo_code)
            if promo_details and promo_details["is_active"]:
                stripe_coupon_id_to_apply = promo_details["stripe_coupon_id"]
            else:
                # Optional: Fehler werfen, wenn der Promo-Code ungültig oder inaktiv ist
                # Oder einfach ohne Rabatt fortfahren
                print(f"Promo code '{request_data.promo_code}' not found or inactive.")

        checkout_session_params = {
            "payment_method_types": ['card'],
            "line_items": line_items,
            "mode": "subscription",
            "success_url": request_data.success_url + "?session_id={CHECKOUT_SESSION_ID}",
            "cancel_url": request_data.cancel_url,
            "metadata": metadata if metadata else None,
            # "allow_promotion_codes": True if request_data.promo_code else None, # Entfernt, da wir jetzt direkt Coupons anwenden
        }

        # Füge den Coupon hinzu, wenn ein gültiger Stripe Coupon gefunden wurde
        if stripe_coupon_id_to_apply:
            checkout_session_params["discounts"] = [{ "coupon": stripe_coupon_id_to_apply }]
        # Wenn kein promo_code gesendet wurde oder der Code ungültig ist, wird allow_promotion_codes nicht gesetzt
        # Stripe erlaubt dann immer noch die manuelle Eingabe im Checkout, wenn im Stripe Dashboard so konfiguriert.
        # Um das zu verhindern, müsste man explizit `allow_promotion_codes = False` setzen, wenn kein gültiger Code von uns kommt.
        # Für den aktuellen Fall: Wenn ein Code von uns kommt und gültig ist, wenden wir ihn an.
        # Wenn nicht, überlassen wir es der Stripe-Einstellung (standardmäßig oft true).
        # Wenn du das Verhalten ändern willst (z.B. keine manuelle Eingabe erlauben, wenn unser Code falsch ist):
        else:
            checkout_session_params["allow_promotion_codes"] = True # Erlaube weiterhin manuelle Eingabe, wenn kein Code von uns kam oder er ungültig war
                                                                # Setze auf False, um manuelle Eingabe zu blockieren, wenn kein gültiger Code von uns kam.

        checkout_session = stripe.checkout.Session.create(**checkout_session_params)
        if checkout_session and checkout_session.url:
            return CheckoutSessionResponse(checkout_url=checkout_session.url, session_id=checkout_session.id)
        else:
            print(f"Stripe Checkout Session Erstellung fehlgeschlagen. Session: {checkout_session}")
            raise HTTPException(status_code=500, detail="Fehler beim Erstellen der Stripe Checkout Session.")

    except stripe.error.StripeError as e:
        print(f"Stripe API Fehler beim Erstellen der Checkout Session: {str(e)}")
        error_message = e.user_message or "Ein Stripe API Fehler ist aufgetreten."
        # Versuche, spezifischere Fehlermeldungen zu geben, falls möglich
        if "No such price" in str(e):
            error_message = f"Ungültige Preis-ID (plan_id): {request_data.plan_id}. Bitte überprüfe die ID in deinem Stripe Dashboard."
        elif "Invalid URL" in str(e):
             error_message = "Ungültige success_url oder cancel_url. Bitte stelle sicher, dass es vollständige URLs sind (z.B. https://example.com/success)."

        raise HTTPException(status_code=e.http_status or 500, detail=error_message)
    except Exception as e:
        print(f"Allgemeiner Fehler in /create-checkout-session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ein interner Fehler ist aufgetreten: {str(e)}")

# Du könntest hier weitere Stripe-bezogene Routen hinzufügen, z.B. für Webhooks
# zum Verarbeiten von `checkout.session.completed` Events.
# Dies ist wichtig, um die Organisation in deiner Datenbank zu erstellen/aktualisieren,
# nachdem die Zahlung erfolgreich war.

@router.get("/checkout-session/{session_id}")
async def get_checkout_session_status(session_id: str):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        # Hier kannst du den Status der Session und die payment_intent ID abrufen
        # und ggf. die Organisation in deiner Datenbank aktualisieren, falls noch nicht geschehen.
        return {
            "status": session.status,
            "payment_status": session.payment_status,
            "customer_email": session.customer_details.email if session.customer_details else None,
            "metadata": session.metadata
        }
    except stripe.error.StripeError as e:
        print(f"Stripe API Fehler beim Abrufen der Checkout Session: {str(e)}")
        raise HTTPException(status_code=e.http_status or 500, detail=str(e.user_message or "Fehler beim Abrufen der Stripe Checkout Session."))
    except Exception as e:
        print(f"Allgemeiner Fehler in /checkout-session/{session_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ein interner Fehler ist aufgetreten: {str(e)}")
