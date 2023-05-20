import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListGroup, Modal, Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import folderImage from "./folder.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/NavBar";

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [showModal, setShowModal] = useState(false);
    let navigate = useNavigate()
    const user = sessionStorage.getItem("email") !== null;

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        const getFileList = async () => {
            let email = sessionStorage.getItem("email");
            console.log(email)
            try {
                const response = await axios.get("http://localhost:8000/api/v1/files", {
                    params: {
                        email: email,
                    },

                });
                setFiles(response.data.files);
            } catch (error) {
                console.error(error);
            }
        };

        getFileList();
    }, []);

    const handleFileClick = async (fileId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/file/${fileId}`);
            setSelectedFile(fileId);
            setFileContent(response.data.content);
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseModal = () => {
        setSelectedFile("");
        setFileContent("");
        setShowModal(false);
    };

    return (
        user && <>
            <Navbar />
            <div>
                <h1>File List:</h1>

                <Row style={{ margin: '30px' }}>
                    {files.map((file, index) => (
                        <Col key={file.file_id} md={6} lg={2}>
                            <Card style={{ width: '10rem', marginBottom: '20px' }}>
                                <Card.Img variant="top" src={folderImage} alt="" />
                                <ListGroup.Item
                                    onClick={() => handleFileClick(file.file_id)}
                                    action
                                    active={selectedFile === file.file_id}
                                >
                                    <i className="bi bi-file-text"></i> {file.filename}
                                </ListGroup.Item>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>File Content</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{fileContent}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default FileList;
