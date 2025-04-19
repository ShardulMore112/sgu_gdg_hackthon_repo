import http.client
import urllib.parse
import json
import google.generativeai as genai

# --- CONFIGS ---
GEMINI_API_KEY = "AIzaSyDNo743WHNdCKKEtuGu3gbl-xoPazjen9I"
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-pro")
chat = model.start_chat()

# --- Get Skill Input ---
skill = input("Enter the skill you're searching jobs for: ").strip()
encoded_skill = urllib.parse.quote(skill)

# --- Fetch Jobs from Indeed India ---
conn = http.client.HTTPSConnection("indeed12.p.rapidapi.com")
headers = {
    'x-rapidapi-key': "83b17199d1msh43aa7020f7ababap1019ddjsn5bb5b5e1e3cd",
    'x-rapidapi-host': "indeed12.p.rapidapi.com"
}
endpoint = f"/jobs/search?query={encoded_skill}&locality=in&start=0"
conn.request("GET", endpoint, headers=headers)
res = conn.getresponse()
data = res.read()

# --- Parse Job Listings ---
response = json.loads(data.decode("utf-8"))
jobs = response.get("hits", [])

if not jobs:
    print("No jobs found for that skill in India.")
    exit()

# --- Prepare Enhanced Job Listings ---
enhanced_jobs = []

for job in jobs:
    title = job.get("title", "N/A")
    location = job.get("location", "N/A")
    company = job.get("company_name", "Unknown")
    link = f"https://www.indeed.com{job.get('link', '')}"
    description = job.get("description", "").strip()

    # Generate a description using Gemini if the description is missing or too short
    if not description or len(description) < 30:  # Checking if description is too short
        gen_prompt = (
            f"Write a 2-3 line job description for a position titled '{title}' "
            f"at '{company}' located in '{location}' that requires the skill '{skill}'."
        )
        try:
            gen_response = model.generate_content(gen_prompt)
            description = gen_response.text.strip()
        except Exception as e:
            print(f"Error generating description: {e}")
            description = f"A {title} position at {company} in {location} requiring {skill} skills."
    
    enhanced_jobs.append({
        "title": title,
        "location": location,
        "company": company,
        "description": description,
        "link": link
    })

# --- Output Final JSON ---
print(json.dumps(enhanced_jobs, indent=2))