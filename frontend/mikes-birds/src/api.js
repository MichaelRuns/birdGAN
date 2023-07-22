import axios from 'axios'

const apiClient = axios.create({
    baseURL: `http://localhost:8000`,
});

export const queryApiForBirds = async () => {
    const formData = new FormData();
    formData.append('bird', 'bird');
    const response = await apiClient.get('/generate', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.generated_birds;   
}