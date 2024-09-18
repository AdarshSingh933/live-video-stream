import React, { useEffect, useState, useRef } from 'react';
import { setupSignalingClient } from '../services/KinesisClient';
import axios from 'axios';

const AdminDashboard = () => {
  const [videoUrls, setVideoUrls] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    // Fetch recorded video URLs from the server
    const fetchVideos = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/videos`);
      setVideoUrls(response.data.videos);
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    // Start the WebRTC client to view the live stream
    setupSignalingClient(videoRef);
  }, []);

  return (
    <div>
      <h2>Recorded Videos</h2>
      {videoUrls.map((url, index) => (
        <video key={index} controls src={url} style={{ width: '100%' }} />
      ))}

      <h2>Live Video Stream</h2>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
    </div>
  );
};

export default AdminDashboard;
