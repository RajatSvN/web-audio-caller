// can put global variables here
let conn;
let remoteContactId;

// connect to express peer server
const peer = new Peer({
  host: "localhost",
  debug: 1,
  port: 8080,
  path: "/callServer",
});

// attach peer to window object
window.peer = peer;

// on connection update the connection Id in UI
peer.on("open", (id) => {
  document.querySelector("#connectId").textContent = id;
});

// maintain localstream so that it can be sent during a call
const getLocalStream = async () => {
  try {
    const userStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    window.localStream = userStream;
    window.localAudio.srcObject = userStream;
    window.localAudio.autoplay = true;
  } catch (err) {
    console.log(`An error occured while capturing Audio Stream ${err}`);
  }
};

getLocalStream();
