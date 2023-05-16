import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const [folderName, setFolderName] = useState('');
    const [file, setFile] = useState(null);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');

    useEffect(() => {
        fetchFolders();
    }, []);

    const createFolder = async () => {
        try {
            await axios.post('/folders', { folder_name: folderName });
            setFolderName('');
            fetchFolders();
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const uploadFile = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            await axios.post(`/folders/${selectedFolder}/files`, formData);
            setFile(null);
            fetchFolders();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const fetchFolders = async () => {
        try {
            const response = await axios.get('/folders');
            setFolders(response.data);
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };

    const fetchFolderFiles = async (folderId) => {
        try {
            const response = await axios.get(`/folders/${folderId}/files`);
            // Handle the response and update the UI as needed
        } catch (error) {
            console.error('Error fetching folder files:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Create Folder</h1>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Folder Name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={createFolder}>
                    Create
                </button>
            </div>

            <h1>Upload File</h1>
            <div className="input-group mb-3">
                <select
                    className="form-select"
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                >
                    <option value="">Select Folder</option>
                    {folders.map((folder) => (
                        <option key={folder._id} value={folder._id}>
                            {folder.name}
                        </option>
                    ))}
                </select>
                <input
                    className="form-control"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button className="btn btn-primary" onClick={uploadFile}>
                    Upload
                </button>
            </div>

            <h1>Folder List</h1>
            <ul className="list-group">
                {folders.map((folder) => (
                    <li
                        key={folder._id}
                        className="list-group-item"
                        onClick={() => fetchFolderFiles(folder._id)}
                    >
                        {folder.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
