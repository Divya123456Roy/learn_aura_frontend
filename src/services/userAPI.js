// userAPI.js
import { BASE_URL } from "../utils/urls";
import { getToken } from "../Utils/StorageHandler";
import axios from "axios";

const getAuthHeaders = () => {
    const token = getToken();
    if (!token) {
        throw new Error("No token found. Please log in.");
    }
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const fetchUserProfileAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/user/profile`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Fetch User Profile API Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Failed to fetch user profile" };
    }
};

export const updateUserProfileAPI = async (formData) => {
    try {
      const response = await axios.put(`${BASE_URL}/user/profile`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data", // Required for FormData
        },
      });
      return response.data;
    } catch (error) {
      console.error("Update User Profile API Error:", error.response?.data?.message || error.message);
      throw error.response?.data || { message: "Failed to update user profile" };
    }
  };
export const fetchUsersAPI = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
        return [];
    }

    try {
        const response = await axios.get(`${BASE_URL}/user/search-users`, {
            params: { search: searchTerm },
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Fetch Users API Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Failed to fetch users" };
    }
};

export const followUserAPI = async (userId) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/follow-user`,
            { userId },
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Follow User API Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Failed to follow user" };
    }
};

export const unfollowUserAPI = async (userId) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/unfollow-user`,
            { userId },
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Unfollow User API Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Failed to unfollow user" };
    }
};

export const sendFriendRequestAPI = async (friendId) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/friend-request`,
            { friendId },
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Send Friend Request API Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Failed to send friend request" };
    }
};

// ✅ FIXED
export const fetchFriendRequestsAPI = async () => {
    const token = getToken();
    try {
      const response = await axios.get(`${BASE_URL}/user/myrequest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { friendRequests: response.data.friendRequests || [] }; // or just response.data if no nesting
    } catch (error) {
      console.error("Fetch Friend Requests API Error:", error.message);
      throw error;
    }
  };
  

export const acceptFriendRequestAPI = async (friendId) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/user/friend-request/accept`,
            { friendId },
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Accept Friend Request API Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Failed to accept friend request" };
    }
};

export const rejectFriendRequestAPI = async (friendId) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/user/friend-request/reject`,
            { friendId },
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Reject Friend Request API Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Failed to reject friend request" };
    }
};

export const createPaymentIntentAPI = async (payload) => {
    
    try {
      const response = await axios.post(`${BASE_URL}/payment/create-payment-intent`, payload, {
        
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating payment intent:", error.response?.data?.message || error.message);
      throw error.response?.data || { message: "Failed to create payment intent" };
    }
  };
  
  export const handlePaymentSuccessAPI = async (payload) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/payment-success`, payload, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error handling payment success:", error.response?.data?.message || error.message);
      throw error.response?.data || { message: "Failed to finalize payment" };
    }
  };


  
  
  