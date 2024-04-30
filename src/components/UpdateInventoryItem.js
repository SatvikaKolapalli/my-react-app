import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UpdateInventoryItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState({ name: '', quantity: '', imageUrl: '' });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchItem();

        // console.log("Item: ", item);
    }, [id]);

    const fetchItem = async () => {
        const _id = id;

        // console.log("Item id: ", _id);
        try {
            const response = await axios.get(`http://localhost:5006/inventory/getItem`, {
                params: { _id: id }
            });
            setItem(response.data.item);
        } catch (err) {
            setError('Failed to fetch item.');
            console.error(err);
        }
    };

    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
    }, []);

    // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    // const uploadImage = async () => {
    //     const formData = new FormData();
    //     formData.append('image', file);

    //     try {
    //         const response = await axios.post('http://localhost:5006/inventory/uploadImage', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         return response.data.data.fileLink;
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //         setError("Failed to upload image.");
    //         throw new Error(error);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file && !item.imageUrl) {
            setError("Please provide an image.");
            return;
        }

        setLoading(true);

        try {
            // const URL = await uploadImage();
            // const imageUrl = file && URL ? URL : item.imageUrl;

            // const imageUrl = file ? await uploadImage() : item.imageUrl;
            const imageUrl = item.imageUrl;

            await axios.put('http://localhost:5006/inventory/updateItem', {
                _id: id,
                name: item.name,
                quantity: item.quantity,
                imageUrl
            });
            navigate('/inventorypage');
        } catch (error) {
            setError('Failed to update item.');
            console.error("Failed to update item: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field: ${name}, Value: ${value}`);
        setItem(prevItem => ({
            ...prevItem,
            [name]: value
        }));
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center mt-5">
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Update Inventory Item</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <div className='image-container d-flex justify-content-center align-items-center me-3'>
                                <img src={item.imageUrl} alt={item.name} style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '20%', border: '1px solid black' }} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="itemName" className="form-label">Item Name</label>
                            <input type="text" className="form-control" id="itemName" name='name' required value={item.name} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="itemQuantity" className="form-label">Quantity</label>
                            <input type="number" className="form-control" id="itemQuantity" name='quantity' required value={item.quantity} onChange={handleChange} />
                        </div>
                        {/* <div {...getRootProps()} className="mb-3 border border-dashed p-5 text-center">
                            <input {...getInputProps()} />
                            {isDragActive ?
                                <p className="text-info">Drop the image here ...</p> :
                                <p>Drag 'n' drop a new image here, or click to select an image</p>}
                            {file ? <p>Selected file: {file.name}</p> : <p>Current Image: {item.imageUrl}</p>}
                        </div> */}
                        <button disabled={loading} className="btn btn-primary w-100" type="submit">Update Item</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateInventoryItem;
