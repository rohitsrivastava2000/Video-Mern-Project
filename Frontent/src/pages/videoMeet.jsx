import React, {
  useEffect,
  useRef,
  useState,
  useCallback,

  memo,
} from "react";
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from 'react-router-dom';
const server_url = "http://localhost:5000";

const connections = {};


const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoComponent = memo(({ stream, socketId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div key={socketId} className="h-full">
      <video className="h-full p-3 object-fill rounded-2xl" ref={videoRef} autoPlay />
    </div>
  );
});

export default function VideoMeetComponent() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [screen, setScreen] = useState(false);
  const [showModal, setModal] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(0);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videos, setVideos] = useState(new Map());

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setVideoAvailable(!!videoPermission);

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioAvailable(!!audioPermission);

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.error("Permissions error:", error);
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  const getMedia = useCallback(() => {
    connectToSocketServer();
  }, []);

  const getUserMediaSuccess = useCallback((stream) => {
    if (window.localStream) {
      window.localStream.getTracks().forEach((track) => track.stop());
    }
    window.localStream = stream;
    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
      console.log("local video stream set inside getusermediaSuccess");
    }

    Object.entries(connections).forEach(([id, connection]) => {
      if (id === socketIdRef.current) return;
      connection.addStream(window.localStream);
      connection
        .createOffer()
        .then((description) => connection.setLocalDescription(description))
        .then(() => {
          socketRef.current.emit(
            "signal",
            id,
            JSON.stringify({ sdp: connections[id].localDescription })
          );
        })
        .catch(console.error);
    });

    stream.getTracks().forEach((track) => {
      track.onended = () => {
        setScreen(false);
        if (localVideoref.current && localVideoref.current.srcObject) {
          localVideoref.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        window.localStream = new MediaStream([black(), silence()]);
        if (localVideoref.current) {
          localVideoref.current.srcObject = window.localStream;
        }
        getUserMedia();
      };
    });
  }, []);

  const getUserMedia = useCallback(() => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch(console.error);
    } else if (localVideoref.current && localVideoref.current.srcObject) {
      localVideoref.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  }, [video, audio, videoAvailable, audioAvailable, getUserMediaSuccess]);

  const gotMessageFromServer = useCallback((fromId, message) => {
    if (fromId !== socketIdRef.current) {
      const signal = JSON.parse(message);
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => connections[fromId].setLocalDescription(description))
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    fromId,
                    JSON.stringify({ sdp: connections[fromId].localDescription })
                  );
                })
                .catch(console.error);
            }
          })
          .catch(console.error);
      }
      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(console.error);
      }
    }
  }, []);

  const handleStream = useCallback((socketId, stream) => {
    setVideos((prevVideos) => {
      const newVideos = new Map(prevVideos);
      newVideos.set(socketId, { socketId, stream });
      return newVideos;
    });
  }, []);

  const connectToSocketServer = useCallback(() => {
    socketRef.current = io.connect(server_url, { secure: false });
    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;
      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", (id) => {
        setVideos((prevVideos) => {
          const newVideos = new Map(prevVideos);
          newVideos.delete(id);
          return newVideos;
        });
        if (connections[id]) {
          connections[id].close();  // Close the peer connection
          delete connections[id];   // Remove it from memory
        }
      });
      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current.emit("signal", socketListId, JSON.stringify({ ice: event.candidate }));
            }
          };
          connections[socketListId].onaddstream = (event) => {
            handleStream(socketListId, event.stream);
          };
          if (window.localStream) {
            connections[socketListId].addStream(window.localStream);
          } else {
            window.localStream = new MediaStream([black(), silence()]);
            connections[socketListId].addStream(window.localStream);
          }
        });
        if (id === socketIdRef.current) {
          Object.entries(connections).forEach(([id2, connection]) => {
            if (id2 === socketIdRef.current) return;
            if (window.localStream) {
                //update the peer connection stream.
                connection.getSenders().forEach((sender)=>{
                    if(sender.track && sender.track.kind === "video"){
                        connection.removeTrack(sender);
                    }
                });
                connection.addTrack(window.localStream.getVideoTracks()[0],window.localStream);
            }
            connection
              .createOffer()
              .then((description) => connection.setLocalDescription(description))
              .then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({ sdp: connections[id2].localDescription })
                );
              })
              .catch(console.error);
          });
        }
      });
    });
  }, [gotMessageFromServer, handleStream]);

  const silence = useCallback(() => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  }, []);

  const black = useCallback(({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    const stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  }, []);

  const addMessage = useCallback((data, sender, socketIdSender) => {
    setMessages((prevMessages) => [...prevMessages, { sender, data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevValue) => prevValue + 1);
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("chat-message", message, username);
    }
    setMessage("");
  }, [message, username]);

  const connect = useCallback(() => {
    setAskForUsername(false);
    getMedia();
  }, [getMedia]);

  const handleVideo = useCallback(() => {
    setVideo((prevVideo) => {
      const newVideoState = !prevVideo;
      if (window.localStream) {
        const videoTrack = window.localStream.getVideoTracks()[0];
        if (videoTrack) {
          if (newVideoState) {
            // Replace with the existing track (turn on)
            Object.values(connections).forEach((connection) => {
              const sender = connection
                .getSenders()
                .find((s) => s.track && s.track.kind === "video");
              if (sender) {
                sender.replaceTrack(videoTrack).catch(console.error);
              }
            });
          } else {
            // Replace with a black track (turn off)
            const blackTrack = black();
            Object.values(connections).forEach((connection) => {
              const sender = connection
                .getSenders()
                .find((s) => s.track && s.track.kind === "video");
              if (sender) {
                sender.replaceTrack(blackTrack).catch(console.error);
              }
            });
          }
        }
      }
      return newVideoState;
    });
  }, []);
  const handleAudio = useCallback(() => setAudio((prevAudio) => !prevAudio), []);

  const getDisplayMediaSuccess = useCallback((stream) => {
    if (window.localStream) {
      window.localStream.getTracks().forEach((track) => track.stop());
    }
    window.localStream = stream;
    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    Object.entries(connections).forEach(([id, connection]) => {
      if (id === socketIdRef.current) return;
      connection.addStream(window.localStream);
      connection
        .createOffer()
        .then((description) => connection.setLocalDescription(description))
        .then(() => {
          socketRef.current.emit(
            "signal",
            id,
            JSON.stringify({ sdp: connections[id].localDescription })
          );
        })
        .catch(console.error);
    });

    stream.getTracks().forEach((track) => {
      track.onended = () => {
        setScreen(false);
        if (localVideoref.current && localVideoref.current.srcObject) {
          localVideoref.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        window.localStream = new MediaStream([black(), silence()]);
        if (localVideoref.current) {
          localVideoref.current.srcObject = window.localStream;
        }
        getUserMedia();
      };
    });
  }, [getUserMedia]);

  const getDisplayMedia = useCallback(() => {
    if (screen && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then(getDisplayMediaSuccess)
        .catch(console.error);
    }
  }, [screen, getDisplayMediaSuccess]);

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  const handleScreen = useCallback(() => {
    setScreen((prevScreen) => !prevScreen);
  }, []);


 
  let routeTO=useNavigate();
  const handleEndCall = useCallback(() => {
    try {
      let tracks = localVideoref.current?.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
  
      if (socketRef.current && socketIdRef.current) {
        socketRef.current.emit("leave-call", socketIdRef.current);
      }
  
      Object.values(connections).forEach((connection) => {
        connection.close();
      });
  
      Object.keys(connections).forEach((id) => {
        delete connections[id];
      });
  
      window.localStream = null;
      setVideos(new Map());
  
    } catch (error) {
      console.log(error);
    }
    routeTO('/home');
  }, []);
  

  const handleChat = useCallback(() => setModal((prevModal) => !prevModal), []);

  useEffect(() => {
    if (window.localStream && localVideoref.current) {
      localVideoref.current.srcObject = window.localStream;
    }
  }, [window.localStream]);

  return (
    <div className="h-screen w-screen">
      {askForUsername ?(
        <div className="flex flex-col items-center justify-center h-full bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Enter Into Lobby</h2>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 w-64"
          />
          <Button variant="contained" onClick={connect} className="mb-6 w-64">
            Connect
          </Button>
          <div className="rounded-lg mt-2 overflow-hidden shadow-lg border">
            <video
              ref={localVideoref}
              autoPlay
              muted
              className="w-80 h-48 object-cover bg-black"
            />
          </div>
        </div>
      ) : (
        <div className={`bg-sky-200 transition-all duration-400 ${showModal ? "w-[75%]" : "w-[100%]"} h-screen`}>
          <div
            className={`fixed text-center top-0 h-screen w-[25%] bg-white shadow-2xl p-4 transition-transform duration-300 ease-in-out ${
              showModal ? "translate-x-0" : "translate-x-full"
            } right-0`}
          >
            <h2 className="text-lg font-bold">Chat</h2>
            <div className="overflow-y-auto h-[85%] bg-gray-100 rounded-lg shadow-inner">
              {messages.map((value, index) => (
                <div key={index} className="text-left p-2">
                  <p className="font-bold">{value.sender}</p>
                  <p>{value.data}</p>
                </div>
              ))}
            </div>
            <input
              type="text"
              className="w-full p-2 border rounded mt-2"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" onClick={sendMessage} className="!m-0.5">
              Send
            </Button>
          </div>
          <div className="h-[20vh] w-full bg-[rgb(8,8,8)]">
            <div className="flex flex-wrap justify-center gap-2.5 h-full">
              {[...videos.values()].map((video) => (
                <VideoComponent key={video.socketId} stream={video.stream} socketId={video.socketId} />
              ))}
            </div>
          </div>
          <div className="h-[80%] w-full bg-amber-100 relative ">
            <video
              className="rounded absolute bottom-0 w-full h-[100%] object-fill "
              ref={localVideoref}
              autoPlay
              muted
            />
            <div className="absolute bottom-0 z-1 bg-[rgb(35,36,28)] w-full flex justify-center p-1 opacity-96 gap-7  ">
              <IconButton onClick={handleVideo}>
                {video ? (
                  <VideocamIcon className="!w-12 !h-12 text-[rgb(160,160,160)] " />
                ) : (
                  <VideocamOffIcon className="!w-9 !h-9 text-[rgb(160,160,160)]" />
                )}
              </IconButton>
              <IconButton onClick={handleAudio}>
                {audio ? (
                  <MicIcon className="!w-9 !h-9 text-[rgb(160,160,160)] " />
                ) : (
                  <MicOffIcon className="!w-9 !h-9 text-[rgb(160,160,160)] " />
                )}
              </IconButton>
              {screenAvailable && (
                <IconButton onClick={handleScreen}>
                  {screen ? (
                    <ScreenShareIcon className="!w-12 !h-12 text-[rgb(160,160,160)]" />
                  ) : (
                    <StopScreenShareIcon className="!w-9 !h-9 text-[rgb(160,160,160)]" />
                  )}
                </IconButton>
              )}
              <Badge badgeContent={newMessages} max={999} color="secondary">
                <IconButton onClick={handleChat}>
                  <ChatIcon className="!w-9 !h-9 text-[rgb(255,255,255)]" />
                </IconButton>
              </Badge>
              <IconButton onClick={handleEndCall} >
                <CallEndIcon  className="text-red-600 !w-9 !h-9" />
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}