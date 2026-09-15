const API_BASE = "http://localhost:8080/api";

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

window.api = {
    getSystemInfo
};