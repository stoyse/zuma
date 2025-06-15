import uuid

def generate_userid(organisation: str) -> str:
    """
    Generate a unique user ID based on the organisation name.

    Args:
        organisation (str): The name of the organisation.

    Returns:
        str: A unique user ID.
    """
    unique_id = uuid.uuid4().hex[:8]  # Generate a short unique identifier
    return f"{organisation.lower()}_{unique_id}"

# Example usage
if __name__ == "__main__":
    org_name = "ExampleOrg"
    user_id = generate_userid(org_name)
    print(f"Generated User ID: {user_id}")