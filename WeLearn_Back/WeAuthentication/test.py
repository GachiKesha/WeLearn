import requests

r = requests.get("http://127.0.0.1:8000/test_token/", headers={
    "Authorization": "Token "
})
print(r.status_code)