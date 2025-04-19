import google.generativeai as genai
import json
import PyPDF2
import os
import requests
from typing import Dict, List, Optional

class EnhancedCourseRecommender:
    def __init__(self, gemini_api_key: str, youtube_api_key: str):
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")
        self.youtube_api_key = youtube_api_key

    def extract_text_from_pdf(self, pdf_file) -> str:
        return ''.join([page.extract_text() for page in PyPDF2.PdfReader(pdf_file).pages])

    def get_resume_text(self, resume_file) -> str:
        if isinstance(resume_file, str) and os.path.exists(resume_file):
            with open(resume_file, 'rb' if resume_file.endswith('.pdf') else 'r', encoding=None if resume_file.endswith('.pdf') else 'utf-8') as f:
                return self.extract_text_from_pdf(f) if resume_file.endswith('.pdf') else f.read()
        elif hasattr(resume_file, 'read'):
            return self.extract_text_from_pdf(resume_file) if getattr(resume_file, 'name', '').endswith('.pdf') else resume_file.read().decode('utf-8') if hasattr(resume_file.read(), 'decode') else resume_file.read()
        raise ValueError("Unsupported input type")

    def search_youtube_tutorials(self, skill: str, language: Optional[str] = None, max_results: int = 1) -> List[Dict]:
        query = f"{skill} tutorial" + (f" {language}" if language else "")
        lang_map = {"hindi": "hi", "tamil": "ta", "telugu": "te", "kannada": "kn", "marathi": "mr"}
        params = {
            "part": "snippet", "q": query, "maxResults": max_results, "type": "video",
            "videoDefinition": "high", "videoDuration": "medium", "key": self.youtube_api_key
        }
        if language and language.lower() in lang_map:
            params["relevanceLanguage"] = lang_map[language.lower()]
        try:
            res = requests.get("https://www.googleapis.com/youtube/v3/search", params=params).json()
            return [{
                "title": item['snippet']['title'],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "thumbnail": item['snippet']['thumbnails']['medium']['url'],
                "description": item['snippet']['description']
            } for item in res.get('items', [])]
        except:
            return []

    def get_course_recommendations(self, resume_file, career_goal: Optional[str] = None, language: Optional[str] = None, num_courses: int = 10, num_videos: int = 5) -> str:
        resume_text = self.get_resume_text(resume_file)
        skill_prompt = f"""You are an expert career advisor. Given resume: {resume_text} Career Goal: {career_goal or "infer"} Identify 5 key skills as JSON list."""
        skill_resp = self.model.generate_content(skill_prompt).text
        if "```json" in skill_resp: skill_resp = skill_resp.split("```json")[1].split("```")[0].strip()
        elif "```" in skill_resp: skill_resp = skill_resp.split("```")[1].split("```")[0].strip()
        try: skills = json.loads(skill_resp)
        except: skills = [s.strip(' "[]\'') for s in skill_resp.split(',')]

        course_prompt = f"""You are a career advisor. Given resume: {resume_text} Career Goal: {career_goal or "infer"} Recommend {num_courses} real online courses in JSON format:
        [{{
            "title": "", "platform": "", "description": "", "url": "", "skill_category": "", "Price": "", "Time ": ""
        }}]"""
        course_resp = self.model.generate_content(course_prompt).text
        if "```json" in course_resp: course_resp = course_resp.split("```json")[1].split("```")[0].strip()
        elif "```" in course_resp: course_resp = course_resp.split("```")[1].split("```")[0].strip()
        try: courses = json.loads(course_resp)
        except json.JSONDecodeError as e:
            return json.dumps([{"error": str(e), "raw_response": course_resp}], indent=2)

        youtube_videos = []
        for skill in skills[:num_videos]:
            videos = self.search_youtube_tutorials(skill, language)
            if videos:
                v = videos[0]
                youtube_videos.append({
                    "title": v["title"], "platform": "YouTube", "description": f"Free tutorial on {skill}",
                    "url": v["url"], "skill_category": skill, "is_free": True, "thumbnail": v["thumbnail"]
                })
        return json.dumps(courses + youtube_videos, indent=2)

def get_recommendations_as_json(resume_file_path, career_goal=None, language="English", num_courses=10, num_videos=5, output_file=None):
    gemini_key = os.environ.get("GEMINI_API_KEY", "AIzaSyDFZNoS5qURtMUil8USVcpP9pIBU5EiBVg")
    yt_key = os.environ.get("YOUTUBE_API_KEY", "AIzaSyCA3BLjs5QpGDsPedrozg2uIn3yuLZoOJs")
    recommender = EnhancedCourseRecommender(gemini_key, yt_key)
    data = recommender.get_course_recommendations(resume_file_path, career_goal, language, num_courses, num_videos)
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f: f.write(data)
    else: return data

if __name__ == "__main__":
    get_recommendations_as_json(
        resume_file_path=r"D:\main_project_sgu\sgu_gdg_hackthon_repo\resume\Shardulmoreresume (2).pdf",
        career_goal="Machine Learning Engineer",
        language="English",
        num_courses=10,
        num_videos=5,
        output_file="course_recommendations.json"
    )
    print("Recommendations saved.")
