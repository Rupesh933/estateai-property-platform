const API_BASE_URL = "http://127.0.0.1:8000/api";


async function apiRequest(endpoint, options = {}) {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        }
    );


    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }


    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.error ||
            "API request failed"
        );
    }


    return data;
}


async function getProperties(filters = {}) {

    const params = new URLSearchParams();


    Object.entries(filters).forEach(
        ([key, value]) => {

            if (
                value !== "" &&
                value !== null &&
                value !== undefined
            ) {
                params.append(key, value);
            }

        }
    );


    const queryString = params.toString();


    const endpoint = queryString
        ? `/properties/?${queryString}`
        : `/properties/`;


    return apiRequest(endpoint);
}

async function getPropertyDetail(slug) {
    return apiRequest(
        `/properties/${encodeURIComponent(slug)}/`
    );
}

async function loginUser(email, password) {
    return apiRequest("/auth/login/", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });
}