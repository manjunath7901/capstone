import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarOutSide from '../NavBar/NavBarOutSide';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';

import { useEffect } from 'react';

function Login() {
    const user = sessionStorage.getItem("email") !== null;
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        event.preventDefault();

        const formdata = new FormData();
        formdata.append('email', formData.email);
        formdata.append('password', formData.password);
        formdata.append('file', formData.file);

        try {
            const response = await axios.post(
                'http://localhost:8001/api/v1/login',
                formdata,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            ).then((res) => {
                if (res.data.status === "success") {
                    alert("Logged in successfully")
                    sessionStorage.setItem("name", res.data.name)
                    sessionStorage.setItem("email", res.data.email)
                    navigate('/file')
                } else if(res.data.status === "email"){
                    alert("Invalid email");
                }else if(res.data.status === "password"){
                    alert("Invalid password");
                }else if(res.data.status === "face"){
                    alert("Face not matching");
                }

            });

        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <>
            <NavBarOutSide />
            <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: '100px' }}>
                <div className="scrollable-form-container">
                    <form className="p-5 shadow-lg rounded" onSubmit={handleSubmit}>
                        <h2 className="text-center mb-3">Login</h2>
                        <div className="form-group mb-2">
                            <label>Email:</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group mb-2">
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <h5>Image Uploader</h5>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {showCamera && <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />}
                                {showCamera && <button onClick={handleCapture} className="btn btn-primary">Capture Image</button>}
                                {!showCamera && <button onClick={handleOpenCamera} className="btn btn-primary">Open Camera</button>}
                            </div></div>
                        {uploadedImage && (
                            <div>
                                <h5>captured Image</h5>
                                <img src={uploadedImage} alt="Uploaded" />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Login</button>
                        <div className="text-center mt-3">
                            Don't have an account? <Link to="/signup">Create Account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;














// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
// import NavBarOutSide from '../NavBar/NavBarOutSide';
// import { Link } from 'react-router-dom';

// function Login() {
//     const user = sessionStorage.getItem("email") !== null;
//     let navigate = useNavigate();
//     useEffect(() => {
//         if (user) {
//             navigate('/');
//         }
//     }, []);

//     const [formData, setFormData] = useState({ email: '', password: '' });

//     const handleChange = event => {
//         setFormData({ ...formData, [event.target.name]: event.target.value });
//     };

//     const handleSubmit = async event => {
//         event.preventDefault();

//         axios.post('http://localhost:8001/api/v1/login', {
//             email: formData.email,
//             password: formData.password
//         }).then((res) => {

//             if (res.data.status == true) {
//                 alert("Logged in successfully")
//                 sessionStorage.setItem("name", res.data.name)
//                 sessionStorage.setItem("email", res.data.email)
//                 navigate('/file')

//             }
//             else {
//                 alert('Invalid email or password')
//             }
//         })

//     };

//     return (
//         !user &&
//         <>
//             <NavBarOutSide />
//             <div className="container d-flex justify-content-center align-items-center vh-100">
//                 <form className="p-5 shadow-lg rounded" onSubmit={handleSubmit}>
//                     <h2 className="text-center mb-4">Login</h2>
//                     <div className="form-group mb-4">
//                         <label>Email:</label>
//                         <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
//                     </div>
//                     <div className="form-group mb-4">
//                         <label>Password:</label>
//                         <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
//                     </div>
//                     <button type="submit" className="btn btn-primary">Log in</button>
//                     <div className="text-center mt-3">
//                         Don't have an account? <Link to="/signup">Create Account</Link>
//                     </div>
//                 </form>
//             </div>

//         </>
//     );
// }

// export default Login;
