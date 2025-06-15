import random
import uuid
import hashlib

def generate_sso_token():
    token = random.randint(100000, 999999)
    return str(token)

def generate_token():
    random_uuid = uuid.uuid4()
    random_number = random.randint(100000, 999999)
    combined = f"{random_uuid}{random_number}"
    complex_token = hashlib.sha256(combined.encode()).hexdigest()
    return complex_token