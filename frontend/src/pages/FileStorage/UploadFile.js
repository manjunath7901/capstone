import React, { useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";

const UploadFile = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileSelect = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    };

    const onUpload = async () => {
        if (!selectedFile) {
            console.log("No file selected.");
            return;
        }
        console.log(selectedFile)
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {

            const response = await axios.post("http://localhost:8000/api/v1/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Dropzone onDrop={onFileSelect} accept=".txt">
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag and drop a text file here, or click to select a file</p>
                    </div>
                )}
            </Dropzone>
            <button onClick={onUpload} disabled={!selectedFile}>
                Upload
            </button>
        </div>
    );
};

export default UploadFile;
