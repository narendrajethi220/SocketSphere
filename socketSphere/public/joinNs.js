const joinNs = (element, nsData) => {
  const nsEndpoints = element.getAttribute("ns");
  // console.log(nsEndpoints);

  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoints);
  //global so we can submit the new message to the right place
  selectedNsId = clickedNs.id;
  const rooms = clickedNs.rooms;

  //get the room-list div
  let roomList = document.querySelector(".room-list");
  //clear it out
  roomList.innerHTML = "";

  //init first room variable
  let firstRoom;

  //loop through each room, and add it to the DOM
  rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.roomTitle;
    }
    roomList.innerHTML += `<li class="room" namespaceId=${
      room.namespaceId
    }><span class="fa-solid fa-${room.privateRoom ? "lock" : "globe"}"></span>${
      room.roomTitle
    }</li>`;
  });

  //init join first room (more asynchronus)
  joinRoom(firstRoom, clickedNs.id);

  // adding click listener to each room so the client can tell the server it wants to join!
  const roomNodes = document.querySelectorAll(".room");
  Array.from(roomNodes).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      // console.log("Someone clicked on " + e.target.innerText);
      const namespaceId = elem.getAttribute("namespaceId");
      joinRoom(e.target.innerText, namespaceId);
    });
  });
  //   console.log(element);
  localStorage.setItem("lastNs", nsEndpoints);
  //   console.log("element", element);
};
