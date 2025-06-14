import requests
import json

res = requests.post("http://192.168.178.145:11434/api/generate", json={
    "model": "gemma3:1b",
    "prompt": "Explain gravity in simple terms.",
    "stream": True
})

for line in res.iter_lines():
    if line:
        data = json.loads(line.decode("utf-8"))
        if "response" in data:
            print(data["response"], end="", flush=True)