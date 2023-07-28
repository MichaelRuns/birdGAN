import axios from 'axios'
const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const apiClient = axios.create({
    baseURL: backendURL,
});

export const queryApiForBirds = async () => {
    const response = await apiClient.get('/generate');
    return response.data.generated_birds;   
}
