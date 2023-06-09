import React from "react";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand">
                    CAM
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-link active" aria-current="page" href="/file">
                            Upload File
                        </a>
                        <a className="nav-link" href="/listfiles">
                            List File
                        </a>
                        <a className="nav-link" href="/logout">
                            Logout
                        </a>

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
