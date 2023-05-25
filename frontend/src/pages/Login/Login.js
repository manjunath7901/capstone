import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import NavBarOutSide from '../NavBar/NavBarOutSide';
import { Link } from 'react-router-dom';

function Login() {
    const user = sessionStorage.getItem("email") !== null;
    let navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, []);

    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = event => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async event => {
        event.preventDefault();

        axios.post('http://localhost:8001/api/v1/login', {
            email: formData.email,
            password: formData.password
        }).then((res) => {

            if (res.data.status == true) {
                alert("Logged in successfully")
                sessionStorage.setItem("name", res.data.name)
                sessionStorage.setItem("email", res.data.email)
                navigate('/file')

            }
            else {
                alert('Invalid email or password')
            }
        })

    };

    return (
        !user &&
        <>
            <NavBarOutSide />
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
                    <div className="text-center mt-3">
                        Don't have an account? <Link to="/signup">Create Account</Link>
                    </div>
                </form>
            </div>

        </>
    );
}

export default Login;
