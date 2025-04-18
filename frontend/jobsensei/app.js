async function getRecommendations() {
  const skills = document.getElementById("skillsInput").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "🔍 Analyzing your skills...";

  const response = await fetch("/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      skills: skills.split(",").map(skill => skill.trim())
    })
  });

  const data = await response.json();

  resultDiv.innerHTML = `
    <h3>💼 Recommended Jobs</h3>
    <ul>${data.jobs.map(job => `<li>${job}</li>`).join("")}</ul>
    <h3>📚 Recommended Courses</h3>
    <ul>${data.courses.map(course => `<li>${course}</li>`).join("")}</ul>
  `;
}
