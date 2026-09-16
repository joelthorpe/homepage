const API_BASE = "/api";

async function getSystemInfo() {
    try {
        const response = await fetch(`${API_BASE}/system-info`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch system info:", error);
        return null;
    }
}

async function getTasks() {
    try {
        const response = await fetch(`${API_BASE}/todos`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        return null;
    }
}

async function addTask(text) {
    try {
        const response = await fetch(`${API_BASE}/todos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to add task:", error);
        return null;
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.ok;
    } catch (error) {
        console.error("Failed to delete task:", error);
        return false;
    }
}

async function toggleTask(id) {
    try {
        const response = await fetch(`${API_BASE}/todos/${id}/toggle`, {
            method: "PATCH"
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.ok;
    } catch (error) {
        console.error("Failed to toggle task:", error);
        return false;
    }
}

async function getWeather(city = "London") {
    try {
        const response = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city)}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        return null;
    }
}

async function getWeatherCodes() {
    try {
        const response = await fetch('/data/wmo_codes.json');
        if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch weather codes:", error);
        return null;
    }
}

async function getServices() {
    try {
        const response = await fetch(`${API_BASE}/services`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return null;
    }
}

window.api = {
    getSystemInfo,
    getTasks,
    addTask,
    deleteTask,
    toggleTask,
    getWeather,
    getWeatherCodes,
    getServices
};