import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { acceptFriendRequestAPI, fetchFriendRequestsAPI, rejectFriendRequestAPI } from '../services/userAPI';
import { getToken } from '../utils/storageHandler';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!token) {
        toast.error('Please log in to view friend requests.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchFriendRequestsAPI();
        setFriendRequests(data?.friendRequests || []);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        toast.error(error.message || 'Failed to fetch friend requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [token]);

  const handleAcceptRequest = async (friendId) => {
    try {
      const response = await acceptFriendRequestAPI(friendId);
      toast.success(response.message || 'Friend request accepted!');
      setFriendRequests((prev) => prev.filter((request) => request._id !== friendId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error(error.message || 'Failed to accept friend request.');
    }
  };

  const handleRejectRequest = async (friendId) => {
    try {
      const response = await rejectFriendRequestAPI(friendId);
      toast.success(response.message || 'Friend request rejected.');
      setFriendRequests((prev) => prev.filter((request) => request._id !== friendId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error(error.message || 'Failed to reject friend request.');
    }
  };

  const filteredRequests = friendRequests.filter((request) =>
    request?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Friend Requests</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by username"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="flex justify-center">
          <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        </div>
      ) : filteredRequests.length === 0 ? (
        <p className="text-gray-600 text-center">No pending friend requests.</p>
      ) : (
        <ul className="space-y-4">
          {filteredRequests.map((request) => (
            <li
              key={request._id}
              className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">{request.username?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{request.username}</p>
                  <p className="text-sm text-gray-500">{request.email}</p>
                  <p className="text-sm text-gray-500">{request.role}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAcceptRequest(request._id)}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                  title="Accept friend request"
                  aria-label={`Accept friend request from ${request.username}`}
                >
                  <FaCheck size={16} />
                </button>
                <button
                  onClick={() => handleRejectRequest(request._id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  title="Reject friend request"
                  aria-label={`Reject friend request from ${request.username}`}
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FriendRequests;