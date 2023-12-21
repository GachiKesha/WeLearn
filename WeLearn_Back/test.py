import requests

r = requests.get("http://127.0.0.1:8000/test_token/", headers={
    "Authorization": "Token 25d1949510a7416f3024631f183c6d3a74c2356c"
})
print(f"{r.status_code}\n{r}")

r = requests.get("http://127.0.0.1:8000/peer/", headers={
    "Authorization": "Token 25d1949510a7416f3024631f183c6d3a74c2356c"
})
print(f"{r.status_code}\n{r}")