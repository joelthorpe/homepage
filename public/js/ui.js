function createProgressRow(label, percent, value) {
    const color = percent > 80 ? "var(--status-stopped)" : "var(--accent-color)";

    return `
        <div class="stat-item">
            <span class="stat-label">${label}</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percent}%; background: ${color}"></div>
            </div>
            <span class="stat-value">${value}</span>
        </div>
    `;
}

function createInfoRow(label, value) {
    return `
        <div class="stat-item">
            <span class="stat-label">${label}</span>
            <span class="stat-value" style="margin-top: auto;">${value}</span>
        </div>
    `;
}

function renderSystemStats(stats) {
    const container = document.getElementById("stats");

    if (!stats) {
        container.innerHTML = `<p style="color: var(--status-stopped);">Failed to load stats.</p>`;
        return;
    }

    const cpuLoad = Number(stats.cpuLoad);
    const memUsed = Number(stats.memUsed);
    const memTotal = Number(stats.memTotal);
    const netRx = Number(stats.netRx);
    const netTx = Number(stats.netTx);
    const netStatus = String(stats.netStatus);
    const storageUsed = Number(stats.storageUsed);
    const storageTotal = Number(stats.storageTotal);
    const storagePercent = Number(stats.storagePercent);
    const uptime = String(stats.uptime);

    const memPercent = (memUsed / memTotal) * 100;

    container.innerHTML = `
        ${createProgressRow("CPU Load", cpuLoad, `${cpuLoad.toFixed(1)}%`)}
        ${createProgressRow("Memory", memPercent, `${memUsed.toFixed(1)}GB / ${memTotal.toFixed(1)}GB`)}
        ${createInfoRow("Network", `${netStatus.toUpperCase()} | ${netRx.toFixed(1)}MB/s | ${netTx.toFixed(1)}MB/s`)}
        ${createProgressRow("Storage", storagePercent, `${storageUsed.toFixed(1)}GB / ${storageTotal.toFixed(1)}GB`)}
        ${createInfoRow("Uptime", uptime)}
    `;
}

function renderTasks(tasks) {
    const container = document.getElementById("tasks-container");

    if (tasks === null || tasks.length === 0) {
        const message = document.createElement("li");
        message.textContent = tasks === null ? "Failed to load tasks" : "No tasks left";
        message.style.color = tasks === null ? "var(--status-stopped)" : "var(--text-muted)";
        message.style.listStyle = "none";
        container.replaceChildren(message);
        return;
    }

    const rows = tasks.map(task => {
        const row = document.createElement("li");
        row.classList.add("task-item");
        row.dataset.id = task.id;

        const content = document.createElement("div");
        content.classList.add("task-content");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("toggle-checkbox");
        checkbox.checked = task.completed;

        const text = document.createElement("span");
        text.classList.add("task-text");
        if (task.completed) {
            text.classList.add("task-completed");
        }
        text.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "X";

        content.append(checkbox, text);
        row.append(content, deleteBtn);

        return row;
    });

    container.replaceChildren(...rows);
}

function getWeatherInfo(code, mapping, isDay = true) {
    const defaultInfo = { description: "Unknown", image: "" };
    if (!mapping) return defaultInfo;
    const timeOfDay = isDay ? "day" : "night";

    return mapping?.[code]?.[timeOfDay] || defaultInfo;
}

function renderWeather(weather, city, mapping) {
    const container = document.getElementById("weather-widget");

    const locationForm = document.createElement("form");
    locationForm.id = "weather-location-form";

    const locationInput = document.createElement("input");
    locationInput.id = "weather-location-input";
    locationInput.type = "text";
    locationInput.value = city;

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.textContent = "Save";
    saveButton.classList.add("weather-save-btn");

    locationForm.append(locationInput, saveButton);

    if (!weather) {
        const message = document.createElement("p");
        message.textContent = "Failed to load weather";
        message.style.color = "var(--status-stopped)";
        message.style.listStyle = "none";

        locationForm.style.display = "flex";
        container.replaceChildren(locationForm, message);
        return;
    }

    const { location, current, daily } = weather;

    const now = Date.now();
    const sunrise = new Date(daily.sunrise).getTime();
    const sunset = new Date(daily.sunset).getTime();
    const isDay = now >= sunrise && now <= sunset;

    const info = getWeatherInfo(current.code, mapping, isDay);

    const locationDisplay = document.createElement("div");
    locationDisplay.id = "weather-location-display";

    const locationText = document.createElement("span");
    locationText.textContent = location;
    locationText.classList.add("weather-location-text");

    const editButton = document.createElement("button");
    editButton.id = "edit-location-btn";
    editButton.type = "button";
    editButton.textContent = "[ edit ] ";

    locationDisplay.append(locationText, editButton);

    const details = document.createElement("div");
    details.classList.add("weather-details");

    const icon = document.createElement("img");
    if (info.image) {
        icon.src = info.image;
    } else {
        icon.hidden = true;
    }
    icon.alt = info.description;
    icon.width = 50;
    icon.height = 50;

    const conditions = document.createElement("div");

    const temperature = document.createElement("div");
    temperature.textContent = `${current.temp}°C`;
    temperature.classList.add("weather-temp");

    const description = document.createElement("div");
    description.textContent = info.description;
    description.classList.add("weather-desc");

    conditions.append(temperature, description);

    const range = document.createElement("div");
    range.classList.add("weather-range");

    const high = document.createElement("div");
    high.textContent = `H: ${daily.max}°C`;

    const low = document.createElement("div");
    low.textContent = `L: ${daily.min}°C`;

    range.append(high, low);
    details.append(icon, conditions, range);

    container.replaceChildren(locationDisplay, locationForm, details);
}

function renderServices(servicesData) {
    const container = document.getElementById("services-container");
    container.replaceChildren();

    if (!Array.isArray(servicesData) || servicesData.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No services configured";
        message.classList.add("empty-message");
        container.appendChild(message);
        return;
    }

    servicesData.forEach(categoryObj => {
        if (!categoryObj || typeof categoryObj !== "object") return;
        const categoryName = Object.keys(categoryObj)[0];
        const categoryServices = categoryObj[categoryName];

        if (!categoryName || !Array.isArray(categoryServices)) return;

        const categorySection = document.createElement("div");
        categorySection.classList.add("service-category");

        const categoryTitle = document.createElement("h3");
        categoryTitle.className = "category-title";
        categoryTitle.textContent = categoryName;
        categorySection.appendChild(categoryTitle);

        const categoryGrid = document.createElement("div");
        categoryGrid.className = "service-grid";

        categoryServices.forEach(service => {
            if (!service || typeof service !== "object") return;
            const serviceName = Object.keys(service)[0];
            const serviceInfo = service[serviceName];

            if (!serviceName || !serviceInfo || typeof serviceInfo !== "object") return;

            const serviceCard = document.createElement("a");
            serviceCard.className = "service-card";
            serviceCard.href = serviceInfo.href;
            serviceCard.target = "_blank";
            serviceCard.rel = "noopener noreferrer";

            const serviceIcon = document.createElement("img");
            serviceIcon.src = serviceInfo.icon || "https://placehold.co/128x128";
            serviceIcon.alt = serviceName;
            serviceIcon.classList.add("service-icon");

            const textContainer = document.createElement("div");
            textContainer.className = "service-text";

            const nameEl = document.createElement("div");
            nameEl.textContent = serviceName;
            nameEl.className = "service-name";

            const descEl = document.createElement("div");
            descEl.textContent = serviceInfo.description || serviceInfo.container || "";
            descEl.className = "service-label";

            textContainer.appendChild(nameEl);
            textContainer.appendChild(descEl);

            serviceCard.appendChild(serviceIcon);
            serviceCard.appendChild(textContainer);
            categoryGrid.appendChild(serviceCard);
        });

        categorySection.appendChild(categoryGrid);
        container.appendChild(categorySection);
    });
}

window.ui = {
    renderSystemStats,
    renderTasks,
    renderWeather,
    renderServices
};
