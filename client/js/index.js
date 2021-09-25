const signalComponent = document.querySelector("#signal");

const getRemoteContactId = () => {
  remoteContactId = window.prompt("Enter the Id of Person you want to Call!");
};

// just a helper for UI updates
const setConnectionStatus = (status) => {
  const { type } = status;
  if (type === "init") {
    signalComponent.textContent = `Currently Connected to No One. Call to Connect.`;
  } else if (type === "connecting") {
    signalComponent.textContent = `Trying to connect to ${status.id} ...`;
  } else if (type === "connected") {
    signalComponent.textContent = `Currently Connected to ${status.id}`;
  }
};

// setting caller Audio Stream Helper
const setRemoteStream = (remoteStream) => {
  window.remoteAudio.srcObject = remoteStream;
  window.remoteAudio.autoplay = true;
  window.peerStream = remoteStream;
};

// connect to peer with a given Id
const connectToRemotePeer = () => {
  conn = peer.connect(remoteContactId);
  if (remoteContactId) {
    setConnectionStatus({ type: "connecting", id: remoteContactId });
  }
};

// stop call and reset remote stream
const decline = () => {
  window.remoteAudio.srcObject = null;
  window.remoteAudio.autoplay = false;
  window.peerStream = null;
  setConnectionStatus({ type: "init" });
};

// update conn on receieving connection event
// conn is to be maintained for other tasks
peer.on("connection", (connection) => {
  conn = connection;
});

// initiate a call to remote peer
peer.on("call", (call) => {
  const callerID = call.peer;
  const answerCall = confirm(
    "Would you like to take this Call from " + callerID + " ?"
  );
  if (answerCall) {
    call.answer(window.localStream);
    call.on("stream", (remoteStream) => {
      setRemoteStream(remoteStream);
      setConnectionStatus({ type: "connected", id: callerID });
    });

    conn.on("close", () => {
      console.log("Call Terminated by the Remote User!");
      setConnectionStatus({ type: "init" });
      decline();
    });
  } else {
    console.log("Call Declined");
    setConnectionStatus({ type: "init" });
  }
});

// call on button click
document.querySelector("#call").addEventListener("click", () => {
  getRemoteContactId();
  connectToRemotePeer();

  const call = peer.call(remoteContactId, window.localStream);

  call.on("stream", (remoteStream) => {
    setRemoteStream(remoteStream);
    const remoteID = call.peer;
    setConnectionStatus({ type: "connected", id: remoteID });
  });
});

// decline current call
document.querySelector("#decline").addEventListener("click", () => {
  if (conn) {
    conn.close();
    setConnectionStatus({ type: "init" });
  }
  decline();
});
