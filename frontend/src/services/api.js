import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('launchpad_token');
      localStorage.removeItem('launchpad_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.put('/user/profile', data);

// Users (Admin)
export const getAllUsers = (page = 1) => API.get(`/user/all?page=${page}`);
export const deleteUser = (id) => API.delete(`/user/${id}`);
export const getUserStats = () => API.get('/user/stats');

// Internships
export const getInternships = () => API.get('/internships');
export const getInternship = (id) => API.get(`/internships/${id}`);
export const createInternship = (data) => API.post('/internships', data);
export const updateInternship = (id, data) => API.put(`/internships/${id}`, data);
export const deleteInternship = (id) => API.delete(`/internships/${id}`);

// Payments
export const createPaymentOrder = (data) => API.post('/payment/create-order', data);
export const verifyPayment = (data) => API.post('/payment/verify', data);
export const getPaymentHistory = (all = false) => API.get(`/payment/history?all=${all}`);

// Certificates
export const getMyCertificates = () => API.get('/certificate/my');
export const getAllCertificates = () => API.get('/certificate/all');
export const generateCertificate = (userId, data) => API.post(`/certificate/generate/${userId}`, data);
export const sendCertificate = (userId, data) => API.post(`/certificate/send/${userId}`, data);

// Companies
export const registerCompany = (data) => API.post('/companies', data);
export const getAllCompanies = () => API.get('/companies');

// Contact
export const submitContact = (data) => API.post('/contact', data);

// Applications (new internship flow)
export const submitApplication = (data) => API.post('/applications', data);
export const createApplicationOrder = (data) => API.post('/applications/create-order', data);
export const verifyApplicationPayment = (data) => API.post('/applications/verify-payment', data);
export const confirmUpiPayment = (data) => API.post('/applications/confirm-upi-payment', data);
export const skipPayment = (data) => API.post('/applications/skip-payment', data);
export const shareOfferLetter = (id, data) => API.post(`/applications/share/${id}`, data);
export const getMyApplications = () => API.get('/applications/my');
export const getAllApplications = () => API.get('/applications/all');

// Feedback
export const submitFeedback = (data) => API.post('/feedback', data);

export default API;
