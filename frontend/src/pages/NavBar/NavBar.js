// import React from "react";

// const Navbar = () => {
//     return (
//         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//             <div className="container-fluid">
//                 <a className="navbar-brand">
//                     CAM
//                 </a>
//                 <button
//                     className="navbar-toggler"
//                     type="button"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#navbarNavAltMarkup"
//                     aria-controls="navbarNavAltMarkup"
//                     aria-expanded="false"
//                     aria-label="Toggle navigation"
//                 > 
//                     <span className="navbar-toggler-icon"></span>
//                 </button>
//                 <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
//                     <div className="navbar-nav">
//                         <a className="nav-link active" aria-current="page" href="/file">
//                             Upload File
//                         </a>
//                         <a className="nav-link" href="/listfiles">
//                             List File
//                         </a>
//                         <a className="nav-link" href="/logout">
//                             Logout
//                         </a>

//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

import Nav from 'react-bootstrap/Nav';

import NavDropdown from 'react-bootstrap/NavDropdown';
import { Navbar, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

function NavBar() {
  return (
    <Navbar bg="grey" expand="lg" variant="light" className="custom-shadow">
        
  <Container style={{marginLeft:"0%"}} >
    <Navbar.Brand className="me-lg-0 me-2" href="#home">Authentication Server</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="/file">Upload Files</Nav.Link>
        <Nav.Link href="/listfiles">List Files</Nav.Link>

        
        
        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">
            Another action
          </NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">
            Separated link
          </NavDropdown.Item>
        </NavDropdown> */}
      </Nav >
      <Nav.Link href="/logout" style={{marginRight:"-25%"}}>
        <text>Logout </text>
        <FontAwesomeIcon icon={faSignOutAlt} />
      </Nav.Link>
    </Navbar.Collapse>
  </Container>
</Navbar>

  );
}

export default NavBar;