export const fetchWithAuth = async (url, options = {}, navigate) => {
    const token = localStorage.getItem('token');
    
    const headers = options.headers ? { ...options.headers } : {};

    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions = {
        ...options,
        headers,
    };

    const response = await fetch(url, fetchOptions);

    if (response.status === 401) {
        console.error('Unauthorized: Token may have expired.');
        navigate('/login');
    }

    return response;
};
