import React from 'react';
import VideoCapture from './components/VideoCapture';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <div className="App">
      <h1>Kinesis Video Streaming Demo</h1>
      <VideoCapture />
      {/* <AdminDashboard /> */}
    </div>
  );
}

export default App;
