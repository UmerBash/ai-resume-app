import api from '../utils/api';

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
        const response = await api.post('/resume/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
