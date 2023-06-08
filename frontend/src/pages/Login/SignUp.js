import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarOutSide from '../NavBar/NavBarOutSide';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    file: null,
  });
  const webcamRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleOpenCamera = () => {
    setUploadedImage(null);
    setShowCamera(true);
  };

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUploadedImage(imageSrc);
    setShowCamera(false);

    const blob = await fetch(imageSrc).then(r => r.blob());
    const file = new File([blob], 'captured-image.jpeg', { type: 'image/jpeg' });

    setFormData(prevData => ({ ...prevData, file }));
  };

  const handleSubmit = async event => {
    if(!isFormValid())
    {

     alert("Password is not matching the requirements")
     return ; 
    
    }
    
    event.preventDefault();

    const formdata = new FormData();
    formdata.append('name', formData.name);
    formdata.append('email', formData.email);
    formdata.append('password', formData.password);
    formdata.append('dob', formData.dob);
    formdata.append('file', formData.file);

    try {
      const response = await axios.post(
        'http://localhost:8001/api/v1/adduser',
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ).then((res)=>{
        if(res.data.status===true){
            alert("successfull sign up")
            navigate('/');
        }else{
            alert("user already exist")
        }
        
      });

    //   console.log('User created. Image ID:', response.data.status);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const isPasswordValid = password => {
    // Minimum length: 8 characters
    // Must include at least one special character and one capital letter
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const isFormValid = () => {
    const { name, email, password, dob } = formData;

    // Check if all required fields are filled
    if (!name || !email || !password || !dob) {
      return false;
    }

    // Check if password meets the requirements
    if (!isPasswordValid(password)) {
      
      return false;
    }

    return true;
  };

  return (
    <>
      <NavBarOutSide />
      <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: '100px' }}>
        <div className="scrollable-form-container">
          <form className="p-5 shadow-lg rounded" onSubmit={handleSubmit}>
            <h2 className="text-center mb-3">Sign Up</h2>
            <div className="form-group mb-2">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-2">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-2">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                pattern="(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}"
                title="Password must be at least 8 characters long and include at least one special character and one capital letter"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
  
            <div>
              <text>Image Uploader</text>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {showCamera && <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />}
                {showCamera && <button onClick={handleCapture} className="btn btn-primary">Capture Image</button>}
                {!showCamera && <button onClick={handleOpenCamera} className="btn btn-primary">Open Camera</button>}
              </div>
            </div>
            {uploadedImage && (
              <div>
                <h5>captured Image</h5>
                <img src={uploadedImage} alt="Uploaded" />
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px'}} >
              Sign Up
            </button>
            <div className="text-center mt-3">
              Already have an account? <Link to="/">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
            }  

export default SignUp;
