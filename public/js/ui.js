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
        ${createProgressRow("Network", netStatus, `${netRx.toFixed(1)}MB/s | ${netTx.toFixed(1)}MB/s`)}
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

window.ui = {
    renderSystemStats,
    renderTasks
};