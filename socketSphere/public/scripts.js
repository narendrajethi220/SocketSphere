const username = prompt("Please enter username");
const password = prompt("Please enter userpassword");

const socket = io("http://localhost:8080");
socket.on("connect", () => {
  console.log("Connected!");
  socket.emit("Client Connected");
});

// listen for the namespaces list event from the server
socket.on("nsList", (nsData) => {
  console.log(nsData);
  const nameSpacesDiv = document.querySelector(".namespaces");
  nsData.forEach((ns) => {
    // update the HTML with each ns
    nameSpacesDiv.innerHTML += ` <div class="namespace" ns="${ns.name}"><img src="${ns.image}"></div>`;
  });
});
