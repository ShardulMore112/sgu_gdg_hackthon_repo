// Call your Flask backend endpoints here
async function fetchJobs() {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    document.getElementById('jobsList').innerText = JSON.stringify(data);
  }
  
  async function fetchCourses() {
    const res = await fetch('/api/courses');
    const data = await res.json();
    document.getElementById('courseList').innerText = JSON.stringify(data);
  }
  