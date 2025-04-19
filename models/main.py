import google.generativeai as genai
import json
import PyPDF2
import os
import requests
from typing import Dict, List, Union, Optional

class EnhancedCourseRecommender:
    def __init__(self, gemini_api_key: str, youtube_api_key: str):
        """
        Initialize the course recommender with API keys.
        
        Args:
            gemini_api_key: API key for Google's Gemini model
            youtube_api_key: API key for YouTube Data API
        """
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")
        self.youtube_api_key = youtube_api_key
    
    def extract_text_from_pdf(self, pdf_file) -> str:
        """Extract text from a PDF file."""
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    
    def get_resume_text(self, resume_file) -> str:
        """Process the resume file which could be PDF file object or path."""
        if isinstance(resume_file, str):
            # Check if input is a file path
            if resume_file.endswith('.pdf') and os.path.exists(resume_file):
                with open(resume_file, 'rb') as f:
                    return self.extract_text_from_pdf(f)
            elif resume_file.endswith('.txt') and os.path.exists(resume_file):
                with open(resume_file, 'r', encoding='utf-8') as f:
                    return f.read()
            else:
                raise ValueError("File path must be a PDF or TXT file that exists")
        elif hasattr(resume_file, 'read'):
            # File-like object
            if getattr(resume_file, 'name', '').endswith('.pdf'):
                return self.extract_text_from_pdf(resume_file)
            else:
                # Assume txt file
                return resume_file.read().decode('utf-8') if hasattr(resume_file.read(), 'decode') else resume_file.read()
        else:
            raise ValueError("Unsupported resume input type. Please provide a file path or file object.")
    
    def search_youtube_tutorials(self, skill: str, language: Optional[str] = None, max_results: int = 1) -> List[Dict]:
        """
        Search for tutorial videos on YouTube based on skill.
        
        Args:
            skill: The skill or topic to search for
            language: Optional language filter
            max_results: Maximum number of results to return
            
        Returns:
            List of dictionaries containing video information
        """
        base_url = "https://www.googleapis.com/youtube/v3/search"

        query = f"{skill} tutorial"
        if language:
            query += f" {language}"

        language_codes = {
            "hindi": "hi",
            "tamil": "ta",
            "telugu": "te",
            "kannada": "kn",
            "marathi": "mr"
        }

        params = {
            "part": "snippet",
            "q": query,
            "maxResults": max_results,
            "type": "video",
            "videoDefinition": "high",
            "videoDuration": "medium",
            "key": self.youtube_api_key
        }

        if language and language.lower() in language_codes:
            params["relevanceLanguage"] = language_codes[language.lower()]

        try:
            response = requests.get(base_url, params=params)
            response.raise_for_status()
            results = response.json()
            
            videos = []
            if 'items' in results:
                for item in results['items']:
                    videos.append({
                        "title": item['snippet']['title'],
                        "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                        "thumbnail": item['snippet']['thumbnails']['medium']['url'],
                        "description": item['snippet']['description']
                    })
            return videos
            
        except Exception as e:
            print(f"YouTube API Error: {e}")
            return []
    
    def get_course_recommendations(self, resume_file, 
                                  career_goal: Optional[str] = None,
                                  language: Optional[str] = None,
                                  num_courses: int = 10,
                                  num_videos: int = 5) -> str:
        """
        Get course recommendations based on resume file and optional career goal.
        
        Args:
            resume_file: Resume file object or file path (.pdf or .txt)
            career_goal: Optional career goal to guide recommendations
            language: Optional language preference for YouTube videos
            num_courses: Number of courses to recommend (default: 10)
            num_videos: Number of YouTube videos to include (default: 5)
            
        Returns:
            JSON string containing course recommendations and YouTube videos
        """
        resume_text = self.get_resume_text(resume_file)
        
        # First, get skill areas from resume using Gemini
        skill_prompt = f"""
        You are an expert career advisor.

        Given the following resume text:
        {resume_text}

        Career Goal: {career_goal if career_goal else "Please infer from resume"}

        Identify the top 5 most important skill areas that this person should focus on
        to advance their career or meet their career goal. Return your answer as a valid
        JSON array of strings. For example:
        ["Machine Learning", "Python Programming", "Data Visualization", "Cloud Computing", "SQL"]
        """
        
        skill_response = self.model.generate_content(skill_prompt)
        skill_text = skill_response.text
        
        # Extract the JSON array of skills
        if "```json" in skill_text:
            skill_text = skill_text.split("```json")[1].split("```")[0].strip()
        elif "```" in skill_text:
            skill_text = skill_text.split("```")[1].split("```")[0].strip()
            
        try:
            key_skills = json.loads(skill_text)
        except json.JSONDecodeError:
            # If parsing fails, make a best guess at the skills
            key_skills = [s.strip(' "[]\'') for s in skill_text.split(',')]
            
        # Get course recommendations
        course_prompt = f"""
        You are an expert career advisor and online course recommender.

        Given the following resume text:
        {resume_text}

        Career Goal: {career_goal if career_goal else "Please infer from resume"}

        Recommend exactly {num_courses} top-rated online courses from trusted providers like Coursera, edX, Udemy, LinkedIn Learning, etc.
        
        Return ONLY a list of recommendations in valid JSON format with the following structure:
        [
            {{
                "title": "Course Title",
                "platform": "Platform Name",
                "description": "Short course description",
                "url": "course_url",
                "skill_category": "What skill area this course addresses"
                "Price": "Inr. Price",
                "Time ": "Time to complete the course"
            }},
            ... more courses ...
        ]
        
        Ensure the JSON is correctly formatted and can be parsed by Python's json.loads().
        Include a diverse set of courses that covers both immediate skill gaps and future career development.
        Do NOT include placeholder URLs or fake courses - use real courses that exist.
        """
        
        course_response = self.model.generate_content(course_prompt)
        
        try:
            # Extract and parse the JSON
            course_text = course_response.text
            
            if "```json" in course_text:
                course_text = course_text.split("```json")[1].split("```")[0].strip()
            elif "```" in course_text:
                course_text = course_text.split("```")[1].split("```")[0].strip()
                
            course_recommendations = json.loads(course_text)
            
            # Add YouTube tutorial videos
            youtube_videos = []
            for skill in key_skills[:num_videos]:  # Get videos for top skills
                videos = self.search_youtube_tutorials(skill, language)
                if videos:
                    video = videos[0]  # Get the first (best) video
                    youtube_videos.append({
                        "title": video["title"],
                        "platform": "YouTube",
                        "description": f"Free tutorial on {skill}",
                        "url": video["url"],
                        "skill_category": skill,
                        "is_free": True,
                        "thumbnail": video["thumbnail"]
                    })
            
            # Combine course recommendations with YouTube videos
            combined_recommendations = course_recommendations + youtube_videos
            
            # Return JSON string instead of the actual list
            return json.dumps(combined_recommendations, indent=2)
            
        except json.JSONDecodeError as e:
            # If parsing fails, return error as JSON
            error_json = [{
                "error": f"Failed to parse JSON response from model: {str(e)}",
                "raw_response": course_response.text
            }]
            return json.dumps(error_json, indent=2)

def get_recommendations_as_json(resume_file_path, career_goal=None, language="English", 
                                num_courses=10, num_videos=5, output_file=None):
    """
    Get course recommendations and save to JSON file.
    
    Args:
        resume_file_path: Path to resume file (.pdf or .txt)
        career_goal: Optional career goal to guide recommendations
        language: Language preference for YouTube videos
        num_courses: Number of courses to recommend
        num_videos: Number of YouTube videos to include
        output_file: Path to save JSON output (if None, will return JSON string)
        
    Returns:
        JSON string if output_file is None, otherwise None (saves to file)
    """
    # Get API keys from environment variables or replace with your keys
    gemini_api_key = os.environ.get("GEMINI_API_KEY", "AIzaSyDFZNoS5qURtMUil8USVcpP9pIBU5EiBVg")
    youtube_api_key = os.environ.get("YOUTUBE_API_KEY", "AIzaSyCA3BLjs5QpGDsPedrozg2uIn3yuLZoOJs")
    
    recommender = EnhancedCourseRecommender(gemini_api_key, youtube_api_key)
    
    # Get recommendations as JSON string
    json_data = recommender.get_course_recommendations(
        resume_file=resume_file_path,
        career_goal=career_goal,
        language=language,
        num_courses=num_courses,
        num_videos=num_videos
    )
    
    # Save to file if output_file is specified
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(json_data)
        return None
    else:
        return json_data

# Usage example
if __name__ == "__main__":
    resume_path = r"D:\main_project_sgu\sgu_gdg_hackthon_repo\resume\Shardulmoreresume (2).pdf"
    output_file_path = "course_recommendations.json"
    
    # Save recommendations to JSON file
    get_recommendations_as_json(
        resume_file_path=resume_path,
        career_goal="Machine Learning Engineer",
        language="English",
        num_courses=10,
        num_videos=5,
        output_file=output_file_path
    )
    
    print(f"Course recommendations saved to {output_file_path}")