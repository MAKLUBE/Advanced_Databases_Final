function getToken() {
    return localStorage.getItem("token");
}

async function api(path, options = {}) {
    const headers = options.headers || {};
    headers["Content-Type"] = "application/json";

    const token = getToken();
    if (token) headers["Authorization"] = "Bearer " + token;

    const res = await fetch(window.API_URL + path, {
        ...options,
        headers
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}
