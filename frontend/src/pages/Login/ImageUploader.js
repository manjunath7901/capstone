import React, { useState, useRef } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import Webcam from "react-webcam";

const ImageUploader = () => {
  const webcamRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false); // New state to control camera visibility

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUploadedImage(imageSrc);
    setShowCamera(false); // Hide the camera after capturing the image

    const blob = await fetch(imageSrc).then((r) => r.blob());
    const file = new File([blob], "captured-image.jpeg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Image uploaded. Image ID:", response.data.image_id);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleOpenCamera = () => {
    setUploadedImage(null); // Clear the uploaded image when opening the camera
    setShowCamera(true);
  };

  return (
    <div>
      <h1>Image Uploader</h1>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {showCamera && <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />}
        {showCamera && <button onClick={handleCapture}>Capture Image</button>}
        {!showCamera && <button onClick={handleOpenCamera}>Open Camera</button>}
      </div>
      {uploadedImage && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={uploadedImage} alt="Uploaded" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
