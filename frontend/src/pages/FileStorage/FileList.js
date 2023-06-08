import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListGroup, Modal, Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Trash, Eye } from 'react-bootstrap-icons';
import folderImage from "./folder.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/NavBar";


const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedfname, setSelectedFname] = useState("");
  let navigate = useNavigate();
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
        const response = await axios.get("http://localhost:8001/api/v1/files", {
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
      const response = await axios.get(`http://localhost:8001/api/v1/file/${fileId}`);
      setSelectedFile(fileId);
      setSelectedFname(response.data.name);
      setFileContent(response.data.content);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
  
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8001/api/v1/delete/${fileId}`);
        const updatedFiles = files.filter((file) => file.file_id !== fileId);
        setFiles(updatedFiles);
        setSelectedFile("");
        setFileContent("");
      } catch (error) {
        console.error(error);
      }
    }
  };
  

  const handleDownload = async (fileId) => {
    if (!selectedfname || !fileContent) {
      alert('No file selected');
      return;
    }
  
    const blob = new Blob([fileContent], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const filename = selectedfname;
  
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    alert('Download started');
  
    setSelectedFile('');
    setFileContent('');
    setShowModal(false);
  };
  
  

const handleClose =()=>{
    setSelectedFile("");
    setFileContent("");
    setShowModal(false);

    
}
  return (
    <>
      {user && (
        <>
          <Navbar />
          <div>
            <h2>File List</h2>
  
            <Row style={{ margin: '30px' }}>
              {files.map((file, index) => (
                <Col key={file.file_id} md={8} lg={3}>
                    
                  <Card style={{ width: '10rem', marginBottom: '20px' }}>
                  <Card.Title>{file.filename}</Card.Title>
                    <Card.Img variant="top" src={folderImage} alt="" style={{marginTop:'5px'}} />
                    <ListGroup.Item
                    style={{margin:"5px"}}
                    //   onClick={() => handleFileClick(file.file_id)}
                    //   action
                    //   active={selectedFile === file.file_id}
                    >
                      <Row className="align-items-center">
                        <Col>
                         
                        <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleFileClick(file.file_id)}
                        className="text-decoration-none border-0 p-0"
                        >
                        <Eye color="black" size={30} className="border border-dark rounded" style={{padding:'3px'}} />
                        </Button>

                        </Col>
                        <Col>
                          <Button
                            variant="outline-danger"
                            secondary
                            size="sm"
                            onClick={() => handleDeleteFile(file.file_id)}
                          >
                            <Trash />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </Card>
                </Col>
              ))}
            </Row>
  
            <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>File Content</Modal.Title>
            </Modal.Header>
            <Modal.Body>{fileContent}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleDownload(selectedFile)}>
                Download
                </Button>
            </Modal.Footer>
            </Modal>
          </div>
        </>
      )}
    </>
  );
  
              }
export default FileList;
