import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Création d'une instance axios avec configuration de base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Services pour les commandes
export const commandeService = {
    getAllCommandes: () => api.get('/commandes'),
    getCommandeById: (id) => api.get(`/commandes/${id}`),
    createCommande: (data) => api.post('/commandes', data),
    updateCommande: (id, data) => api.put(`/commandes/${id}`, data),
};

// Services pour les médicaments
export const medicationService = {
    getAllMedications: () => api.get('/medications'),
    getMedicationById: (id) => api.get(`/medications/${id}`),
    searchMedications: (term) => api.get(`/medications/search/${term}`),
};

// Services pour les pharmaciens
export const pharmacistService = {
    getAllPharmacists: () => api.get('/pharmacists'),
    getPharmacistById: (id) => api.get(`/pharmacists/${id}`),
};

// Services pour les praticiens
export const practitionerService = {
    getAllPractitioners: () => api.get('/practitioners'),
    getPractitionerById: (id) => api.get(`/practitioners/${id}`),
};

export default api; 