import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = event => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async event => {
        event.preventDefault();

        axios.post('http://localhost:8000/api/v1/login', {
            email: formData.email,
            password: formData.password
        }).then((res) => {

            if (res.data.status == true) {
                alert("Logged in successfully")
                sessionStorage.setItem("name", res.data.name)
                navigate('/home')

            }
            else {
                alert('Invalid email or password')
            }
        })

    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <form className="p-5 shadow-lg rounded" onSubmit={handleSubmit}>
                <h2 className="text-center mb-4">Login</h2>
                <div className="form-group mb-4">
                    <label>Email:</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group mb-4">
                    <label>Password:</label>
                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary">Log in</button>
            </form>
        </div>
    );
}

export default Login;
