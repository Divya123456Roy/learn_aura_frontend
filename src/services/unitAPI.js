
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";
import axios from "axios";


export const createUnitAPI = async (unitData) => {
    const token = getToken();
    const response = await axios.post(`${BASE_URL}/unit`, unitData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": `Bearer ${token}`,
      },
    });
      return response.data;
  };


export const getAllUnitsAPI = async () => {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

   return{
        Authorization: `Bearer ${token}`,
  };
    };

    

export const getUnitByIdAPI = async (unitId) => {
 
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    return {
        Authorization: `Bearer ${token}`,
      };
    };

    
export const getUnitsByModuleIdAPI = async (moduleId) => {
  
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/unit/module/${moduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    })
    return response.data;
    };


   

    export const updateUnitAPI = async ({ unitId, unitData }) => {
      const token = getToken();
      
      try {
        const response = await axios.put(`${BASE_URL}/unit/${unitId}`, unitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
    
    export const deleteUnitAPI = async (unitId) => {
      const token = getToken()
      try {
        const response = await axios.delete(`${BASE_URL}/unit/${unitId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };