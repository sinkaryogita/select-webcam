import React, { useState, useRef } from 'react';

const Webcam = () => {
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const videoPlayerRef = useRef();
  let streamRef = useRef();

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
  };

  const setCameraDevicesFn = (mediaDevices) => {
    let count = 0;
    const videoDevices = [];
    mediaDevices.forEach((mediaDevice) => {
      if (mediaDevice.kind === 'videoinput') {
        count += 1;
        const option = {
          deviceId: mediaDevice.deviceId,
          label: mediaDevice.label || `Camera ${count}`, // label is not available unless browser permission is granted.
        };
        videoDevices.push(option);
      }
    });
    setCameraDevices(videoDevices);
  };

  const startCamera = (deviceId) => {
    if (typeof streamRef.current !== 'undefined') {
      stopCamera();
    }

    const videoConstraints = {};
    if (!deviceId) {
      videoConstraints.facingMode = 'user'; //choose default front-facing camera initiallu
    } else {
      videoConstraints.deviceId = { exact: deviceId }; //choose user-selected camera
    }
    const constraints = {
      video: videoConstraints,
      audio: false,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      streamRef.current = stream;
      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = stream;
        videoPlayerRef.current.play();
      }
    });
    if (deviceId) {
      setSelectedCamera(deviceId);
    }

    navigator.mediaDevices.enumerateDevices().then(setCameraDevicesFn);
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      {cameraDevices.length > 0 ? (
        <div>
          <h3>Face Liveliness Comp</h3>
          <select
            value={selectedCamera}
            onChange={(e) => startCamera(e.target.value)}
            style={{ margin: '20px' }}
          >
            {cameraDevices.map((camera) => (
              <option value={camera.deviceId} key={camera.deviceId}>
                {camera.label}
              </option>
            ))}
          </select>
          <video
            ref={videoPlayerRef}
            width="100%"
            height="100%"
            autoPlay
            playsInline
            muted
          />
        </div>
      ) : (
        <div>
          <h3>Instructions page </h3>
          <p>System's default user-facing camera will open when you click on start.</p>
          <p>
            You will also see a dropdown that lists all the available camera's identified in the system.
          </p>
          <p>You can opt for the camera of your preference from the list.</p>
          <button onClick={() => startCamera()}>Start</button>
        </div>
      )}
    </div>
  );
};

export default Webcam;
