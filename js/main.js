document.addEventListener("DOMContentLoaded", () => {
    async function init() {
        await updateSystemStats();
        await updateTasks();
        setInterval(updateSystemStats, 5000);
    }

    async function updateSystemStats() {
        const stats = await window.api.getSystemInfo();
        window.ui.renderSystemStats(stats);
    }

    async function updateTasks() {
        const tasks = await window.api.getTasks();
        window.ui.renderTasks(tasks);
    }

    document.getElementById("add-task-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("new-task");
        const text = input.value.trim();
        if (text) {
            const task = await window.api.addTask(text);

            if (!task) {
                console.error("Failed to add task");
                return;
            }

            input.value = "";
            updateTasks();
        }
    });

    document.getElementById("tasks-container").addEventListener("click", async (e) => {
        const taskEl = e.target.closest("[data-id]");
        if (!taskEl) return;

        if (e.target.classList.contains("delete-btn")) {
            const id = taskEl.dataset.id;
            const task = await window.api.deleteTask(id);

            if (!task) {
                console.error("Failed to delete task");
                return;
            }

            updateTasks();
        } else if (e.target.classList.contains("task-text") || e.target.classList.contains("toggle-checkbox")) {
            const id = taskEl.dataset.id;
            const task = await window.api.toggleTask(id);

            if (!task) {
                console.error("Failed to toggle task");
                return;
            }

            updateTasks();
        }
    });

    init();
});