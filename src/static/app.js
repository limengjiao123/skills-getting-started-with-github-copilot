document.addEventListener("DOMContentLoaded", async () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  if (!activitiesList || !activitySelect) return;
  activitiesList.innerHTML = "<p>Loading activities...</p>";
  try {
    const res = await fetch("/activities");
    const activities = await res.json();
    activitiesList.innerHTML = "";
    activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
    Object.entries(activities).forEach(([name, info]) => {
      // 活动卡片
      const card = document.createElement("div");
      card.className = "activity-card";
      card.innerHTML = `
        <h4>${name}</h4>
        <p><strong>Description:</strong> ${info.description}</p>
        <p><strong>Schedule:</strong> ${info.schedule}</p>
        <p><strong>Max Participants:</strong> ${info.max_participants}</p>
        <div class="participants-section">
          <strong>Participants:</strong>
          ${
            info.participants.length
              ? `<ul class="participants-list">${info.participants
                  .map(
                    (email) =>
                      `<li><span class="participant-email">${email}</span></li>`
                  )
                  .join("")}</ul>`
              : `<span class="no-participants">No participants yet.</span>`
          }
        </div>
      `;
      activitiesList.appendChild(card);

      // 下拉选项
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      activitySelect.appendChild(opt);
    });
  } catch (e) {
    activitiesList.innerHTML = "<p>Failed to load activities.</p>";
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });
});
