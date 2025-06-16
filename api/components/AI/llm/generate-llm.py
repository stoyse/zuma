import requests
import json

def generate_ai_output(api_url, model_name, prompt):
    try:
        payload = {"model": model_name, "prompt": prompt}
        headers = {"Content-Type": "application/json"}
        response = requests.post(f"{api_url}/api/generate", json=payload, headers=headers)
        response.raise_for_status()
        result = response.json()
            # Assumption: The generated output is under the "output" key
        if "output" in result:
            return result["output"]
        else:
            print("Unexpected response format:", result)
            return ""
    except requests.RequestException as e:
        print(f"Error generating AI output: {e}")
        return ""