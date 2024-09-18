import { SignalingClient, Role } from 'amazon-kinesis-video-streams-webrtc';

/**
 * Sets up the WebRTC signaling client using Kinesis Video Streams.
 */
export const setupSignalingClient = (videoRef) => {
  const region = process.env.REACT_APP_AWS_REGION;
  const channelARN = process.env.REACT_APP_SIGNALLING_CHANNEL_ARN;
  const accessKeyId = process.env.REACT_APP_ACCESS_KEY;
  const secretAccessKey = process.env.REACT_APP_SECRET_KEY;

  const signalingClient = new SignalingClient({
    channelARN,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    role: Role.VIEWER,
  });

  const configuration = {
    iceServers: [
      {
        urls: `stun:stun.kinesisvideo.${region}.amazonaws.com:443`,
      },
    ],
  };

  const peerConnection = new RTCPeerConnection(configuration);
  peerConnection.ontrack = (event) => {
    videoRef.current.srcObject = event.streams[0];
  };

  signalingClient.on('open', async () => {
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await peerConnection.setLocalDescription(offer);
    signalingClient.sendSdpOffer(peerConnection.localDescription);
  });

  signalingClient.on('sdpAnswer', async (answer) => {
    await peerConnection.setRemoteDescription(answer);
  });

  signalingClient.on('iceCandidate', async (candidate) => {
    await peerConnection.addIceCandidate(candidate);
  });

  peerConnection.onicecandidate = ({ candidate }) => {
    if (candidate) {
      signalingClient.sendIceCandidate(candidate);
    }
  };

  signalingClient.open();

  return () => {
    signalingClient.close();
    peerConnection.close();
  };
};
