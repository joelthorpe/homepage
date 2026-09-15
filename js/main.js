document.addEventListener("DOMContentLoaded", () => {
    async function init() {
        await updateSystemStats();
        setInterval(updateSystemStats, 5000);
    }

    async function updateSystemStats() {
        const stats = await window.api.getSystemInfo();
        window.ui.renderSystemStats(stats);
    }

    init();
});