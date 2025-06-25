import axios from 'axios';
import { BASE_URL } from '../utils/urls';

// Fetch Chat Messages
export const fetchMessages = async (chatId) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Messages API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong while fetching messages" };
  }
};

// Send Chat Message
export const sendMessageApi = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/chat`, data);
    return response.data;
  } catch (error) {
    console.error("Send Message API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong while sending message" };
  }
};
