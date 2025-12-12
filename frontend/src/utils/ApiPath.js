export const BASE_URL = 'http://localhost:4000';

//Routes used for frontend
export const API_PATHS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        GET_PROFILE: '/api/auth/profile',
        GOOGLE_LOGIN: '/api/auth/google-login',
    },
    ADMIN: {
        GET_STATS: '/api/admin/stats',
    },
    RESUME: {
        CREATE: '/api/resume',
        GET_ALL: '/api/resume',
        GET_BY_ID: (id) => `api/resume/${id}`,

        UPDATE: (id) => `/api/resume/${id}`,
        DELETE: (id) => `/api/resume/${id}`,
        UPLOAD_IMAGE: (id) => `api/resume/${id}/upload-image`,
    },
    IMAGE: {
        UPLOAD_IMAGE: 'api/auth/upload',
    }
}   