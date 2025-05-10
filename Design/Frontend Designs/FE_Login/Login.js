document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // 📌 Placeholder for backend request
    fetch("your-backend-api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Login successful!");
          // redirect or do other actions
        } else {
          alert("Invalid email or password");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Server error. Try again later.");
      });
  });
  