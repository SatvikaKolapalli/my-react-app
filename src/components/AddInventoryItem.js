import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddInventoryItem = () => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const uploadImage = async () => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://ec2-18-227-13-56.us-east-2.compute.amazonaws.com:5006/inventory/uploadImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.data.fileLink;
        } catch (error) {
            console.error('Error uploading file:', error);
            setError("Failed to upload image.");
            throw new Error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !name || !quantity) {
            setError("Please provide all required fields.");
            return;
        }

        setUploading(true);

        try {
            const imageUrl = await uploadImage();
            const payload = { name, quantity, imageUrl };

            await axios.post('http://ec2-18-227-13-56.us-east-2.compute.amazonaws.com:5006/inventory/addItem', payload);
            navigate('/inventorypage');
        } catch (error) {
            console.error('Error adding inventory item:', error);
            setError("Failed to add inventory item.");
            setUploading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Add Inventory Item</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="itemName" className="form-label">Item Name</label>
                            <input type="text" className="form-control" id="itemName" required value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="itemQuantity" className="form-label">Quantity</label>
                            <input type="number" className="form-control" id="itemQuantity" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                        <div {...getRootProps()} className="mb-3 border border-dashed p-5 text-center">
                            <input {...getInputProps()} />
                            {isDragActive ?
                                <p className="text-info">Drop the files here ...</p> :
                                <p>Drag 'n' drop some files here, or click to select files</p>}
                            {file && <p className="mt-2">File: {file.name}</p>}
                        </div>
                        <button disabled={uploading} className="btn btn-primary w-100">Add Item</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddInventoryItem;
