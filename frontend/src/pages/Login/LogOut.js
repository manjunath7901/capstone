import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LogOut = () => {

    let navigate = useNavigate();
    useEffect(() => {
        sessionStorage.clear()
        navigate('/');
    }, [])

    return (
        <div>

        </div>
    )
}

export default LogOut;