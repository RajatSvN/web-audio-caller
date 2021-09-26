// can put global variables here
let conn;
let remoteContactId;
let port;

// https -> prod. env. port == 443, local env. -> 8080
port = location.protocol === "https:" ? 443 : 8080;

// connect to express peer server
const peer = new Peer({
  host: location.hostname,
  debug: 1,
  port: port,
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
