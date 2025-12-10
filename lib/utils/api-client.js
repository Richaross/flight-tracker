/**
 * Generic API Client Wrapper
 * Handles standardized fetching and basic error parsing.
 */
export class ApiClient {
    /**
     * @param {string} baseUrl 
     * @param {object} headers 
     */
    constructor(baseUrl = '', headers = {}) {
        this.baseUrl = baseUrl;
        this.headers = headers;
    }

    /**
     * GET request
     * @param {string} endpoint 
     * @param {object} params - Query parameters 
     */
    async get(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        try {
            const res = await fetch(url.toString(), {
                method: 'GET',
                headers: this.headers
            });

            if (!res.ok) {
                // Try to parse error message
                let errorDetails = {};
                try { errorDetails = await res.json(); } catch(e) {}
                throw new Error(`API Error ${res.status}: ${JSON.stringify(errorDetails)}`);
            }

            return await res.json();
        } catch (error) {
            console.error(`[ApiClient] GET ${endpoint} Failed:`, error);
            throw error;
        }
    }
}
