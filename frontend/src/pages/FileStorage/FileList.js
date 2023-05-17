import React, { useState, useEffect } from "react";
import axios from "axios";

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [fileContent, setFileContent] = useState("");

    useEffect(() => {
        const getFileList = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/files");
                setFiles(response.data.files);
            } catch (error) {
                console.error(error);
            }
        };

        getFileList();
    }, []);

    const handleFileClick = async (fileId) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/v1/file/${fileId}`
            );
            setSelectedFile(fileId);
            setFileContent(response.data.content);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>File List:</h1>
            <ul>
                {files.map((file) => (
                    <li
                        key={file.file_id}
                        onClick={() => handleFileClick(file.file_id)}
                        style={{ cursor: "pointer", fontWeight: selectedFile === file.file_id ? "bold" : "normal" }}
                    >
                        {file.filename}
                    </li>
                ))}
            </ul>
            {selectedFile && (
                <div>
                    <h1>File Content:</h1>
                    <p>{fileContent}</p>
                </div>
            )}
        </div>
    );
};

export default FileList;
