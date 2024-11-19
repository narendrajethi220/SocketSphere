const joinRoom = async (roomTitle, namespaceId) => {
  // console.log(roomTitle, namespaceId);
  const ackResp = await nameSpaceSockets[namespaceId].emitWithAck(
    "joinRoom",
    roomTitle
  );
  // console.log(ackResp);
  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${ackResp.numUsers} Users <span class="fa-solid fa-user"></span></span>`;
  document.querySelector(".curr-room-text").innerHTML = `${roomTitle}`;
};
