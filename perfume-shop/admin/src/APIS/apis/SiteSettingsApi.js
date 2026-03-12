import { api } from './Authapi';

// Get site settings
export const getSiteSettings = async () => {
  try {
    const response = await api.get('site-settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update site settings
export const updateSiteSettings = async (formData) => {
  try {
    const response = await api.put('site-settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
