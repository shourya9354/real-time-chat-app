const API = "http://localhost:5000/api/auth";

/* REGISTER */
async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registration successful");
    window.location.href = "index.html";
  } else {
    alert(data.message);
  }
}

/* LOGIN */
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.clear(); // remove old token
    localStorage.setItem("token", data.token);
    window.location.href = "chat.html";
  } else {
    alert(data.message);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}