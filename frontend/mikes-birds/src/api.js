import axios from 'axios'
const apiClient = axios.create({
    baseURL: `http://localhost:8000`,
});

export const queryApiForBirds = async () => {
    const response = await apiClient.get('/generate');
    return response.data.generated_birds;   
}
