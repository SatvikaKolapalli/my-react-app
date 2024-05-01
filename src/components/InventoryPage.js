import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

const InventoryList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://ec2-18-227-13-56.us-east-2.compute.amazonaws.com:5006/inventory/getItems');
            setItems(response.data.items);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    // const deleteItem = async (id) => {
    //     try {
    //         const response = await axios.delete('http://ec2-18-227-13-56.us-east-2.compute.amazonaws.com:5006/inventory/deleteItem', { _id: id });
            
            
    //         fetchItems();
    //     } catch (error) {
    //         console.error('Error deleting item:', error);
    //     }
    // };

    const deleteItem = async (id) => {
        try {
            const response = await axios({
                method: 'delete', // or 'post' if your server requires a POST request for deletion
                url: 'http://ec2-18-227-13-56.us-east-2.compute.amazonaws.com:5006/inventory/deleteItem',
                data: {
                    _id: id  // Ensure this matches the expected format in the backend
                }
            });
            fetchItems();  // Refresh items after deletion
            console.log('Item deleted successfully:', response.data);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="card" style={{ width: '66.6666%' }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>Inventory List</h5>
                    <Link to="/add-item" className="btn btn-primary">Add Item</Link>
                </div>
                <ul className="list-group list-group-flush">
                    {items.map(item => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={item._id}>
                            <div className="image-container me-3">
                                <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '20%', border: '1px solid black' }} />
                            </div>
                            <div className="flex-grow-1">
                                <strong>{item.name}</strong>
                                <div style={{ marginTop: '0.1rem' }}>Quantity: {item.quantity}</div>
                            </div>
                            <div>
                                <Link to={`/update-item/${item._id}`} className="btn btn-warning me-2">Update</Link>
                                <button className="btn btn-danger" onClick={() => deleteItem(item._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InventoryList;
