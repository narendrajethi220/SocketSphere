const joinNs = (element, nsData) => {
  const nsEndpoints = element.getAttribute("ns");
  // console.log(nsEndpoints);

  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoints);
  const rooms = clickedNs.rooms;

  //get the room-list div
  let roomList = document.querySelector(".room-list");
  //clear it out
  roomList.innerHTML = "";
  //loop through each room, and add it to the DOM
  rooms.forEach((room) => {
    roomList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`;
  });
  //   console.log(element);
  localStorage.setItem("lastNs", nsEndpoints);
  //   console.log("element", element);
};
