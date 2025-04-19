import http.client
import urllib.parse
import json
import google.generativeai as genai
import os
from datetime import datetime

# --- CONFIGS ---
GEMINI_API_KEY = "AIzaSyDFZNoS5qURtMUil8USVcpP9pIBU5EiBVg"
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
    job_type_original = job.get("job_type", "").strip()

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
    
    # Generate additional job details with more specific skills analysis
    details_prompt = (
        f"Based on the job title '{title}' in the field related to '{skill}', provide the following information in JSON format:\n"
        f"1. A likely experience level required (in years)\n"
        f"2. A list of 5-7 specific technical skills likely required for this role.\n"
        f"   For example, if the job is in data science, list specific skills like 'Python', 'Pandas', 'NumPy', 'Scikit-learn', etc.\n"
        f"   If the job is in web development, list specific skills like 'React', 'Node.js', 'Express', 'MongoDB', etc.\n"
        f"3. Whether this position is most likely full-time or part-time\n\n"
        f"Format your response as valid JSON with keys: 'experience_required', 'skills_required', 'job_type'"
    )
    
    try:
        details_response = model.generate_content(details_prompt)
        details_text = details_response.text.strip()
        
        # Extract JSON content - handling potential formatting issues
        if "```json" in details_text:
            json_content = details_text.split("```json")[1].split("```")[0].strip()
        elif "```" in details_text:
            json_content = details_text.split("```")[1].strip()
        else:
            json_content = details_text
            
        details_data = json.loads(json_content)
        
        experience_required = details_data.get("experience_required", "Not specified")
        skills_required = details_data.get("skills_required", [skill])
        if isinstance(skills_required, str):
            skills_required = [s.strip() for s in skills_required.split(",")]
        job_type = details_data.get("job_type", "Not specified")
        
    except Exception as e:
        print(f"Error generating job details: {e}")
        experience_required = "1-3 years"  # Default fallback
        skills_required = [skill]
        job_type = job_type_original if job_type_original else "Full-time"  # Use original if available
    
    enhanced_jobs.append({
        "title": title,
        "location": location,
        "company": company,
        "description": description,
        "experience_required": experience_required,
        "skills_required": skills_required,
        "job_type": job_type,
        "link": link
    })

# --- Save JSON to file ---
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
filename = f"{skill.lower().replace(' ', '_')}_jobs_{timestamp}.json"

with open(filename, 'w', encoding='utf-8') as f:
    json.dump({"search_skill": skill, "jobs": enhanced_jobs}, f, indent=2)

print(f"Job search complete! Found {len(enhanced_jobs)} jobs related to '{skill}'.")
print(f"Results saved to {filename}")

# Also print a sample of the first job as a preview
if enhanced_jobs:
    print("\nSample job entry preview:")
    print(json.dumps(enhanced_jobs[0], indent=2))