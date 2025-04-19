const resetBtn = document.getElementById("resetBtn");
const form = document.getElementById("loginForm");

resetBtn.addEventListener("click", () => {
  // Clear fields
  form.reset();

  // Toggle rotate class
  form.classList.add("rotated");

  // Remove the class after rotation ends (to allow re-trigger)
  setTimeout(() => {
    form.classList.remove("rotated");
  }, 800);
});

// const loginBtn = document.querySelector("button[type='submit']");

// loginBtn.addEventListener("click", (e) => {
//   e.preventDefault(); // prevent form submission
//   loginCard.classList.add("launch");

//   // Optionally redirect after animation (like a successful login)
//   setTimeout(() => {
//     window.location.href = "dashboard.html"; // or your desired page
//   }, 1000);
// });
