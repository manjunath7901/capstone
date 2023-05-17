import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import SignUp from "../pages/Login/SignUp";
import Home from "../pages/Home/Home";
import UploadFile from "../pages/FileStorage/UploadFile";

function PageRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/file" element={<UploadFile />} />
            </Routes>
        </Router>
    );
}

export default PageRoutes;
