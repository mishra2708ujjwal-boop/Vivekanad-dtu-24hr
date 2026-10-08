import urllib.request
import json
import sys

base_url = "http://localhost:8000/api/v1"

def post(endpoint, data=None, token=None):
    body = json.dumps(data).encode() if data is not None else b"{}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(f"{base_url}{endpoint}", data=body, headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def get(endpoint, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(f"{base_url}{endpoint}", headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def put(endpoint, data, token=None):
    body = json.dumps(data).encode()
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(f"{base_url}{endpoint}", data=body, headers=headers, method="PUT")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

print("=== 1. Auth Flow ===", flush=True)
res_otp = post("/auth/otp/request", {"auth_identifier": "aarav@example.com"})
print("OTP Request:", res_otp, flush=True)
res_auth = post("/auth/otp/verify", {"auth_identifier": "aarav@example.com", "otp_code": "123456", "name": "Aarav Sharma"})
token = res_auth["access_token"]
print("Auth Verify:", res_auth["name"], "Token obtained", flush=True)

print("\n=== 2. Profile Flow ===", flush=True)
profile = get("/me/profile", token)
print("Profile Name:", profile["name"], "Language:", profile["language"], flush=True)
update_profile = put("/me/profile", {
    "name": "Aarav Sharma",
    "city_area": "North Delhi",
    "time_availability": "Weekends & Evenings (4-6 hrs/week)",
    "learning_interests": "Organic Farming, Local Governance",
    "resources_offered": "Laptop, Web Hosting",
    "skills": [
        {"skill_name": "Web Frontend", "level": "Experienced", "wants_to_learn": False},
        {"skill_name": "Organic Farming", "level": "Beginner", "wants_to_learn": True}
    ]
}, token)
print("Profile Updated:", update_profile["name"], "Skills count:", len(update_profile.get("skills", [])), flush=True)

print("\n=== 3. Sankalp Flow ===", flush=True)
qualities = get("/sankalps/qualities")
print("Qualities count:", len(qualities), flush=True)
set_sankalp = post("/sankalps/", {"quality": "Humility (Namrata)"}, token)
print("Sankalp set:", set_sankalp, flush=True)
today_sankalp = get("/sankalps/today", token)
print("Today Sankalp:", today_sankalp, flush=True)

print("\n=== 4. Radar Flow ===", flush=True)
radar = get("/opportunities/radar", token)
print("Radar items count:", len(radar), flush=True)
first_opp = radar[0]
print("First opp:", first_opp["title"], "Reason:", first_opp["match_reason"], flush=True)

print("\n=== 5. Opportunity Detail & Consent Flow ===", flush=True)
opp_detail = get(f"/opportunities/{first_opp['id']}", token)
print("Detail:", opp_detail["title"], flush=True)
consent_res = post(f"/opportunities/{first_opp['id']}/consent", {"what_is_shared": "phone_and_name"}, token)
print("Consent:", consent_res, flush=True)

print("\n=== 6. Moment & Reflection Flow ===", flush=True)
moment = post("/moments/", {"opportunity_id": first_opp["id"], "duration_minutes": 60, "is_silent": False}, token)
print("Moment Created ID:", moment["id"], flush=True)
reflection = post(f"/moments/{moment['id']}/reflection", {
    "moment_id": moment["id"],
    "learned": "Learned patience and listening to elders",
    "listened": "Heard about Delhi in the 1960s",
    "expected_recognition": "None",
    "do_differently": "Bring water bottle next time",
    "is_private": True
}, token)
print("Reflection Created ID:", reflection["id"], flush=True)

print("\n=== 7. Journey Flow ===", flush=True)
journey = get("/journey/", token)
print("Journey User:", journey["user_name"], "Timeline items:", len(journey["timeline"]), flush=True)

print("\n=== 8. Circles Flow ===", flush=True)
circles = get("/circles/")
print("Existing Circles count:", len(circles), flush=True)
new_circle = post("/circles/", {
    "group_name": "Delhi Digital Empowerment Circle",
    "recurring_activity": "Weekly Sunday Tech Desk at Community Center",
    "schedule": "Sundays 10 AM",
    "description": "Helping local shopkeepers with UPI and school staff with basic website maintenance."
}, token)
print("New Circle:", new_circle, flush=True)

cid = new_circle["circle_id"]
join_res = post(f"/circles/{cid}/join", {}, token)
print("Join Circle:", join_res, flush=True)

print("\n✨ ALL ENDPOINTS VERIFIED AND CONNECTED SUCCESSFULLY! ✨", flush=True)
