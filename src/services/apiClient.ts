// API Client - Replaces direct Gemini API calls
// File: src/services/apiClient.ts

const API_BASE = process.env.NODE_ENV === 'production'
    ? '' // Same domain in production
    : 'http://localhost:3000'; // Local development

export class ApiClient {
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
            ...options.headers,
        };

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('authToken');
                window.location.reload();
            }
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async generateQuiz(mode: string, textInput: string, files: any[], courseTitle?: string) {
        const result = await this.request('/api/gemini', {
            method: 'POST',
            body: JSON.stringify({
                action: 'generateQuiz',
                payload: { mode, textInput, files, courseTitle }
            }),
        });
        return result.data;
    }

    async generatePPT(lectures: any[]) {
        const result = await this.request('/api/gemini', {
            method: 'POST',
            body: JSON.stringify({
                action: 'generatePPT',
                payload: { lectures }
            }),
        });
        return result.data;
    }

    async chat(context: string, userMessage: string, history: any[]) {
        const result = await this.request('/api/gemini', {
            method: 'POST',
            body: JSON.stringify({
                action: 'chat',
                payload: { context, userMessage, history }
            }),
        });
        return result.data;
    }

    async explainCode(code: string, imageBase64?: string) {
        const result = await this.request('/api/gemini', {
            method: 'POST',
            body: JSON.stringify({
                action: 'explainCode',
                payload: { code, imageBase64 }
            }),
        });
        return result.data;
    }

    async login(username: string, password: string) {
        const response = await fetch(`${API_BASE}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            this.token = data.token;
            localStorage.setItem('authToken', data.token);
        }

        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    isAuthenticated() {
        return !!this.token;
    }
}

export const apiClient = new ApiClient();
