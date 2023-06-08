import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import Dropzone from "react-dropzone";
import SelectUsers from "./OptionOutsideSelect";
import "./UploadFile.css"; // Import custom CSS file
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/NavBar";


import { Box, PageHeader } from "grommet";

const UploadFile = () => {
    let navigate = useNavigate();
    const user = sessionStorage.getItem("email") !== null;

    let email=sessionStorage.getItem("email");
    let user_name=sessionStorage.getItem("name")

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, []);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [formData, setFormData] = useState(new FormData());

    const onFileSelect = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    };

    useEffect(() => {
        const user_id = selectedUsers.map((user) => user.value);
        formData.set("authorized_users", JSON.stringify(user_id));
    }, [selectedUsers]);

    const onUpload = async () => {
        if (!selectedFile) {
            console.log("No file selected.");
            return;
        }
        if (selectedUsers.length === 0) {
            alert("Please select at least one user.");
            return;
        }

        try {
            formData.set("file", selectedFile);

            const response = await axios.post(
                "http://localhost:8001/api/v1/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );


            if (response.status === 200) {
                alert("file stored in the data bases ")
                setSelectedFile(null); // Clear the selected file
                setSelectedUsers([]);

            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        user &&
        <>
            <Navbar />
     
            <h3 style={{ textAlign: "left", margin: "20px 0 50px 10px" }}>{`Hello, ${user_name}!`}</h3>



           

            
            <Container>
                
                <Row style={{ marginTop: "50px" }}>
                    <Col>
                        <Dropzone onDrop={onFileSelect} accept=".txt">
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()} className="dropzone-container">
                                    <input {...getInputProps()} className="dropzone-input" />
                                    <p className="dropzone-message">Drag and drop a text file here, or click to select a file</p>
                                </div>
                            )}
                        </Dropzone>
                    </Col>
                </Row>
                
                <Row style={{ marginTop: "100px" }}>
                <h5>Select the users to give the file access</h5>
                    <Col>
                        <SelectUsers

                            selectedUsers={selectedUsers}
                            setSelectedUsers={setSelectedUsers}

                        />
                    </Col>
                </Row>
               
                <Row>
               
                    <Col>
                   
                        <Button
                            style={{ margin: "30px" }}
                            variant="primary"
                            onClick={onUpload}
                            disabled={!selectedFile}
                        >
                            Upload
                        </Button>
                    </Col>
                </Row>

            </Container>
        </>
    );
};

export default UploadFile;
