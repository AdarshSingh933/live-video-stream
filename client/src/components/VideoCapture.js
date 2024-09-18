import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import { setupKinesisVideoClient, sendStreamToKinesis } from './KinesisSetup';

const VideoCapture = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Request access to the webcam
    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        videoRef.current.srcObject = stream;

        // Stream the video to the server
        handleStream(stream);
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    startVideoStream();
  }, []);

  const handleStream = (stream) => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp8'
    });

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        await sendDataToServer(event.data);

        
        const streamName = process.env.REACT_APP_STREAM_NAME; // Define or fetch a dynamic stream name

        try {
          await sendStreamToKinesis(event.data, streamName);
        } catch (err) {
          console.error('Error sending stream to Kinesis: ', err);
        }
      }
    };

    mediaRecorder.start(1000); // Send video data every second
  };

  const sendDataToServer = async (blob) => {
    const formData = new FormData();
    formData.append("video", blob, `student_video_${Date.now()}.webm`);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-video/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      console.error('Error uploading video: ', err);
    }
  };

  return (
    <div>
      <h1>Live Video Stream</h1>
      <video ref={videoRef} autoPlay muted></video>
    </div>
  );
};

export default VideoCapture;
