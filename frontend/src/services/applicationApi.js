// Application endpoints
export const submitApplication = (data) => API.post('/applications', data);
export const createApplicationOrder = (data) => API.post('/applications/create-order', data);
export const verifyApplicationPayment = (data) => API.post('/applications/verify-payment', data);
export const getMyApplications = () => API.get('/applications/my');
export const downloadOfferLetter = (id) => API.get(`/applications/download/${id}`, { responseType: 'blob' });
export const getAllApplications = () => API.get('/applications/all');
