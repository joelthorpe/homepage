document.addEventListener("DOMContentLoaded", () => {
    async function init() {
        await Promise.all([
            updateSystemStats(),
            updateTasks(),
            updateWeather(),
            updateServices()
        ]);

        setInterval(updateSystemStats, 5000);
        setInterval(updateWeather, 1800000);
        setInterval(updateServices, 30000);
    }

    function getCity() {
        return localStorage.getItem("weather_city") || "London";
    }

    function setCity(city = "London") {
        localStorage.setItem("weather_city", city);
    }

    async function updateSystemStats() {
        const stats = await window.api.getSystemInfo();
        window.ui.renderSystemStats(stats);
    }

    async function updateTasks() {
        const tasks = await window.api.getTasks();
        window.ui.renderTasks(tasks);
    }

    let weatherCodes = null;

    async function updateWeather() {
        const city = getCity();
        const weather = await window.api.getWeather(city);
        if (!weatherCodes) {
            weatherCodes = await window.api.getWeatherCodes();
        }
        window.ui.renderWeather(weather, city, weatherCodes);
    }

    async function updateServices() {
        const services = await window.api.getServices();
        window.ui.renderServices(services);
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
            await updateTasks();
        }
    });

    document.getElementById("tasks-container").addEventListener("click", async (e) => {
        const taskEl = e.target.closest("[data-id]");
        if (!taskEl) return;

        if (e.target.classList.contains("delete-btn")) {
            const id = taskEl.dataset.id;
            const deleted = await window.api.deleteTask(id);

            if (!deleted) {
                console.error("Failed to delete task");
                return;
            }

            await updateTasks();
        } else if (e.target.classList.contains("task-text") || e.target.classList.contains("toggle-checkbox")) {
            const id = taskEl.dataset.id;
            const toggled = await window.api.toggleTask(id);

            if (!toggled) {
                console.error("Failed to toggle task");
                return;
            }

            await updateTasks();
        }
    });

    document.querySelector("#weather-widget").addEventListener("click", (e) => {
        if (e.target.id === "edit-location-btn") {
            document.getElementById("weather-location-display").style.display = "none";
            document.getElementById("weather-location-form").style.display = "flex";
            document.getElementById("weather-location-input").focus();
        }
    });

    document.querySelector("#weather-widget").addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("weather-location-input");
        const city = input.value.trim();
        if (city) {
            const weather = await window.api.getWeather(city);

            if (!weatherCodes) {
                weatherCodes = await window.api.getWeatherCodes();
            }
            if (weather) {
                setCity(city);
            }

            window.ui.renderWeather(weather, city, weatherCodes);
        }
    });

    init();
});
