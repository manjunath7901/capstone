import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import SignUp from "../pages/Login/SignUp";
import Home from "../pages/Home/Home";
import UploadFile from "../pages/FileStorage/UploadFile";
import FileList from "../pages/FileStorage/FileList";
import SelectUsers from "../pages/FileStorage/OptionOutsideSelect";
import LogOut from "../pages/Login/LogOut";
function PageRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/file" element={<UploadFile />} />
                <Route path="/listfiles" element={<FileList />} />
                <Route path="/user" element={<SelectUsers />} />
                <Route path="/logout" element={<LogOut />} />

            </Routes>
        </Router>
    );
}

export default PageRoutes;
