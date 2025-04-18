from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for local testing

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    skills = data.get("skills", [])

    # Dummy logic - replace with AI model or Vertex API
    jobs = []
    courses = []

    if "python" in [s.lower() for s in skills]:
        jobs.append("Python Developer")
        courses.append("Python for Beginners - freeCodeCamp")

    if "html" in [s.lower() for s in skills]:
        jobs.append("Frontend Web Developer")
        courses.append("HTML & CSS Crash Course - Traversy Media")

    if "data" in [s.lower() for s in skills] or "analysis" in [s.lower() for s in skills]:
        jobs.append("Data Analyst")
        courses.append("Data Analysis with Pandas - Data School")

    if not jobs:
        jobs.append("Explore Software Testing")
        courses.append("Manual Testing for Beginners")

    return jsonify({"jobs": jobs, "courses": courses})

if __name__ == "__main__":
    app.run(debug=True)
