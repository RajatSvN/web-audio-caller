// can put global variables here
let conn;
let remoteContactId;
let port;

// this is a deployment fix specific to heroku
// can be avoided if app is deployed on a static port
// heroku has dynamic ports
const request = new XMLHttpRequest();
request.open("GET", "/port", false);
request.send(null);

if (request.status === 200) {
  const response = JSON.parse(request.response);
  port = response.port;
}

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
