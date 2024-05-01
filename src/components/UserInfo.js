import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserInfo = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://ec2-18-227-13-56.us-east-2.compute.amazonaws.com:5006/user/getUserInfo`,  {
                    params: { _id: id }
                });
                setUser(response.data.user);
            } catch (err) {
                setError('Failed to fetch user info');
                console.error(err);
            }
        };

        fetchUserInfo();
    }, [id]);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return(
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card border-dark shadow-lg rounded-4">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">User Information</h2>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
