// Central place for the backend API URL.
// Uses REACT_APP_API_URL from .env if set, otherwise defaults to localhost.
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
