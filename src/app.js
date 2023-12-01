document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
  
    const messages = document.getElementById("messages");
    const messageInput = document.getElementById("messageInput");
  
    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };
  
    socket.on("chat message", (data) => {
      const { user, message } = data;
      const li = document.createElement("li");
      li.textContent = `[${getCurrentTime()}] ${user}: ${message}`;
      messages.appendChild(li);
    });
  
    const sendMessage = () => {
      const message = messageInput.value;
      if (message.trim() !== "") {
        const currentTime = getCurrentTime();
        const user = "user"; // You can modify this to include the actual username if you implement user authentication.
        const data = { user, message };
        socket.emit("chat message", data);
        messageInput.value = "";
      }
    };
  
    window.sendMessage = sendMessage; // Expose the function to the global scope
  });