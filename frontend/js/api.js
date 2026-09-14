const API_BASE_URL = "http://127.0.0.1:8000/api";

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
    }

    return data;
}

async function getProperties(filters = {}) {
    const params = new URLSearchParams();

    if (filters.property_type) {
        params.append("property_type", filters.property_type);
    }

    if (filters.city) {
        params.append("city", filters.city);
    }

    if (filters.min_price) {
        params.append("min_price", filters.min_price);
    }

    if (filters.max_price) {
        params.append("max_price", filters.max_price);
    }

    const queryString = params.toString();

    const endpoint = queryString
        ? `/properties/?${queryString}`
        : "/properties/";

    return await apiRequest(endpoint);
}

async function getProperty(slug) {
    return await apiRequest(`/properties/${slug}/`);
}