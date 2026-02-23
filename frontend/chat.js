const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

const socket = io("http://localhost:5000", {
  auth: { token }
});

socket.on("receiveMessage", (data) => {
  const div = document.createElement("div");

  const currentUser = JSON.parse(atob(token.split('.')[1]));

  if (data.userId === currentUser.id) {
    div.classList.add("right");
  } else {
    div.classList.add("left");
  }

  div.innerHTML = `<strong>${data.userName}</strong>: ${data.message}`;
  document.getElementById("messages").appendChild(div);
});

function sendMessage() {
  const input = document.getElementById("message");

  if (input.value.trim() === "") return;

  socket.emit("sendMessage", input.value);
  input.value = "";
}