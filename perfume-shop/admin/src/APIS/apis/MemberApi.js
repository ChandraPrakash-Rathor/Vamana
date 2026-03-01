import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api/admin/members';

// Get auth token from Cookies (admin uses cookies, not localStorage)
const getAuthToken = () => {
  return Cookies.get('authToken');
};

// Get all members
export const getAllMembers = async () => {
  const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Get single member by ID
export const getMemberById = async (id) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Update member status
export const updateMemberStatus = async (id, status) => {
  const token = getAuthToken();
  const response = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// Delete member
export const deleteMember = async (id) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
