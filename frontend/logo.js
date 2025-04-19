const resetBtn = document.getElementById("resetBtn");
const form = document.getElementById("loginForm");

resetBtn.addEventListener("click", () => {
  // Reset input fields
  form.reset();

  // Trigger rotate animation
  form.classList.add("rotated");

  // Remove the class to allow future re-triggers
  setTimeout(() => {
    form.classList.remove("rotated");
  }, 800);
});
