import React, { useState, useRef, useEffect } from 'react';
import './Webcam.css';

const Webcam = ({ onPermissionGranted, onPermissionDenied }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Request camera permissions and setup video stream
  const setupWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: 'user' 
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      setHasPermission(true);
      setIsActive(true);
      
      if (onPermissionGranted) {
        onPermissionGranted();
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setHasPermission(false);
      
      if (onPermissionDenied) {
        onPermissionDenied(err);
      }
    }
  };

  // Cleanup function to stop all video tracks when component unmounts
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Handle permission request button click
  const handleRequestClick = () => {
    setupWebcam();
  };

  // Toggle webcam on/off
  const toggleWebcam = () => {
    if (isActive) {
      stopWebcam();
    } else {
      setupWebcam();
    }
  };

  return (
    <div className="webcam-container">
      {hasPermission === null ? (
        <div className="webcam-permission">
          <p>This lesson works best when we can see you!</p>
          <button 
            className="webcam-permission-button"
            onClick={handleRequestClick}
          >
            Allow Camera Access
          </button>
        </div>
      ) : hasPermission === false ? (
        <div className="webcam-denied">
          <p>Unable to access your camera. Please check your browser permissions.</p>
          <button 
            className="webcam-retry-button"
            onClick={handleRequestClick}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="webcam-active">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted 
            className="webcam-video"
          />
          <button 
            className="webcam-toggle-button"
            onClick={toggleWebcam}
          >
            {isActive ? 'Turn Off Camera' : 'Turn On Camera'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Webcam;