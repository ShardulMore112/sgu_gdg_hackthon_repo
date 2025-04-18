import requests

def search_youtube_tutorials(skill, language=None, max_results=5):
    api_key = "AIzaSyCA3BLjs5QpGDsPedrozg2uIn3yuLZoOJs"  # Replace with your actual YouTube API key
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
        "key": api_key
    }

    if language and language.lower() in language_codes:
        params["relevanceLanguage"] = language_codes[language.lower()]

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}")
    except requests.exceptions.ConnectionError as errc:
        print(f"Error Connecting: {errc}")
    except requests.exceptions.Timeout as errt:
        print(f"Timeout Error: {errt}")
    except requests.exceptions.RequestException as err:
        print(f"OOps: Something Else {err}")

    return None

def extract_and_print_links(search_results):
    if not search_results or 'items' not in search_results:
        print("No results found.")
        return

    print("\nVideos found:\n")
    for item in search_results['items']:
        title = item['snippet']['title']
        video_id = item['id']['videoId']
        url = f"https://www.youtube.com/watch?v={video_id}"
        print(f"{title}\n{url}\n")

def main():
    skill = input("What tutorial or skill are you looking for? ").strip()
    
    language = input("If you want to filter by language (Hindi, Tamil, Telugu, Kannada, Marathi), enter it here or press Enter to skip: ").strip().lower()
    if language == '':
        language = None

    results = search_youtube_tutorials(skill, language)
    extract_and_print_links(results)

if __name__ == "__main__":
    main() 
