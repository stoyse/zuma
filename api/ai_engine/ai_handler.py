import requests
import json

def get_available_models(api_url):
    """
    Fetches the list of available models from the AI engine.

    Args:
        api_url (str): The base URL of the AI engine API.

    Returns:
        list: A list of available model names.
    """
    try:
        response = requests.get(f"{api_url}/api/tags")
        response.raise_for_status()
        tags = response.json()
        # Assumption: Models are listed under the "models" key or directly as a list
        if isinstance(tags, dict) and "models" in tags:
            return tags["models"]
        elif isinstance(tags, list):
            return tags
        else:
            print("Unexpected response format:", tags)
            return []
    except requests.RequestException as e:
        print(f"Error fetching models: {e}")
        return []

# Example usage
if __name__ == "__main__":
    api_url = "http://192.168.178.145:11434"
    models = get_available_models(api_url)
    print("Available models:", models)