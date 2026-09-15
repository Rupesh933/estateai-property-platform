const API_BASE_URL = "http://127.0.0.1:8000/api";


async function apiRequest(endpoint, options = {}) {

    const accessToken = localStorage.getItem("access_token");

    const headers = {
        ...(options.headers || {}),
    };


    // Agar body FormData nahi hai,
    // tab JSON content type use hoga.
    if (!(options.body instanceof FormData)) {

        headers["Content-Type"] = "application/json";

    }


    // Login ke baad access token automatically send hoga
    if (accessToken) {

        headers.Authorization = `Bearer ${accessToken}`;

    }


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: headers,
        }
    );


    let data = null;

    try {

        data = await response.json();

    } catch (error) {

        data = null;

    }


    if (!response.ok) {

        const validationErrors = data &&
            typeof data === "object" &&
            !data.detail &&
            !data.error
            ? Object.entries(data)
                .map(([field, messages]) => {
                    const text = Array.isArray(messages)
                        ? messages.join(", ")
                        : String(messages);

                    return `${field}: ${text}`;
                })
                .join("; ")
            : "";

        throw new Error(
            data?.detail ||
            data?.error ||
            validationErrors ||
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


async function registerUser(userData) {

    return apiRequest("/auth/register/", {
        method: "POST",
        body: JSON.stringify(userData),
    });

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



async function getCurrentUser() {
    return apiRequest("/auth/profile/");
}