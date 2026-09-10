const API_BASE_URL = "http://127.0.0.1:8000/api";

async function getProperties() {
    const response = await fetch(`${API_BASE_URL}/properties/`);

    if (!response.ok) {
        throw new Error("Failed to fetch properties");
    }

    return await response.json();
}