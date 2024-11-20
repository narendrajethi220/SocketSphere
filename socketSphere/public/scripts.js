const username = prompt("Please enter username");
const password = prompt("Please enter userpassword");

// temp remove the promps to save dev headache
// const username = "mrJ";
// const password = "x";

const clientOptions = {
  query: {
    username,
    password,
  },
  auth: {
    username,
    password,
  },
};

const socket = io("http://localhost:8080", clientOptions);

//creating an array of the namsSpaceSockets to store the connections
const nameSpaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

//a global variable we can update when the user clicks on a namespace
//we will use it to broadcast across the app
let selectedNsId = 0;

//add a submit handler for our form
document.querySelector("#message-form").addEventListener("submit", (e) => {
  //keep the browser from submitting
  e.preventDefault();

  //"value" is use in case of text boxes and "innerHTML" is use in case of html tags.
  //grab the value from the input box
  const newMessage = document.querySelector("#user-message").value;

  console.log(newMessage, selectedNsId);
  nameSpaceSockets[selectedNsId].emit("newMessageToRoom", {
    newMessage,
    date: Date.now(),
    avatar: "https://via.placeholder.com/30",
    username,
    selectedNsId,
  });
  document.getElementById("user-message").value = " ";
});

// addListeners job is to manage all listeners added to all namespaces.
//this prevents listeners being added multiple times and makes life better place for us as developers
const addListeners = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("Namespace changed !");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  }
  if (!listeners.messageToRoom[nsId]) {
    // add the nsId listener to this namespace!
    nameSpaceSockets[nsId].on("messageToRoom", (messageObj) => {
      console.log(messageObj);

      document.querySelector("#messages").innerHTML +=
        buildMessageHtml(messageObj); // object object
      //Whenever we try and concatenate an object to a string JavaScript has no idea what we are trying to do
    });
    listeners.messageToRoom[nsId] = true;
  }
};

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

    //initialize thisNS as its index in nameSpaceSockets.
    //If the connection is new, this will be null
    //If the connection has already been established,  it will reconnect and remain in its spots

    if (!nameSpaceSockets[ns.id]) {
      nameSpaceSockets[ns.id] = io(`http://localhost:8080${ns.endpoint}`);
    }
    addListeners(ns.id);
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
