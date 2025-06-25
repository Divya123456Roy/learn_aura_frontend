import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../Utils/StorageHandler";

export const getNotificationsAPI = async (page,limit) => {
      const token = getToken();
      const response = await axios.get(`${BASE_URL}/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params:{
            page,
            limit
        }
      })
      return response.data;
  
  };

  export const deleteNotificationsAPI = async () => {
    const token = getToken();
    const response = await axios.delete(`${BASE_URL}/notification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data;

};

export const markAsReadAPI = async (id) => {
    const token = getToken();
    console.log(token);
    
    const response = await axios.put(`${BASE_URL}/notification/${id}/read`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data;

};

