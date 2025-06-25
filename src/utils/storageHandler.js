import { jwtDecode } from 'jwt-decode';

// 🔐 Get token from sessionStorage
export const getToken = () => {
  return sessionStorage.getItem("userToken") || null;
};

// 🧠 Decode JWT token to get user data (role, id, etc.)
export const decodedData = () => {
  return getToken() ? jwtDecode(getToken()) : null;
};

// 💾 Get full user object from sessionStorage (if stored there)
export const getUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user"));
  } catch {
    return null;
  }
};