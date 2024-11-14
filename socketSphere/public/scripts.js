// const username = prompt("Please enter username");
// const password = prompt("Please enter userpassword");

// temp remove the promps to save dev headache
// const username = "mrJ";
// const password = "x";

const socket = io("http://localhost:8080");
socket.on("connect", () => {
  console.log("Connected!");
  socket.emit("Client Connected");
});

// listen for the namespaces list event from the server
socket.on("nsList", (nsData) => {
  // fetching if there is any lastNs present (in case of browser refresh);
  const lastNs = localStorage.getItem("lastNs");
  // console.log(nsData);
  const nameSpacesDiv = document.querySelector(".namespaces");
  nameSpacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    // update the HTML with each ns
    nameSpacesDiv.innerHTML += ` <div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      // console.log(element);
      element.addEventListener("click", (e) => {
        joinNs(element, nsData);
      });
    }
  );

  //
  if (lastNs) {
    const lastNsElement = Array.from(
      document.getElementsByClassName("namespace")
    ).find((element) => element.getAttribute("ns") === lastNs);
    joinNs(lastNsElement, nsData);
  } else {
    joinNs(document.getElementsByClassName("namespace")[0], nsData);
  }
});
