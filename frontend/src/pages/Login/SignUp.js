import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarOutSide from '../NavBar/NavBarOutSide';
import { Link } from 'react-router-dom';

function SignUp() {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = event => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async event => {
        event.preventDefault();

        axios.post('http://localhost:8000/api/v1/adduser', {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            dob: formData.dateOfBirth
        }).then((res) => {

            if (res.data.status == true) {
                alert("Created")
                navigate('/')
            }
            else {
                alert('User with email is already exsits')

            }
        })
        console.log(formData)
    };

    return (
        <>
            <NavBarOutSide />
            <div className="container d-flex justify-content-center align-items-center vh-100" >
                <form className="p-5 shadow-lg rounded" onSubmit={handleSubmit} >
                    <h2 className="text-center mb-3" >Sign Up</h2>
                    <div className="form-group mb-2">
                        <label>Name:</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Email:</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Password:</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="form-group mb-3">
                        <label>Date of Birth</label>
                        <input type="date" name="dateOfBirth" className="form-control" value={formData.dateOfBirth} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">SignUp </button>
                    <div className="text-center mt-3">
                        Already have account? <Link to="/">Login</Link>
                    </div>

                </form>
            </div>
        </>
    );
}

export default SignUp;
