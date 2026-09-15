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

    if (tasks === null) {
        container.innerHTML = `<li style="color: var(--status-stopped); list-style: none;">Failed to load tasks.</li>`;
        return;
    }

    if (tasks.length === 0) {
        container.innerHTML = `<li style="color: var(--text-muted); list-style: none;">No tasks left.</li>`;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <li class="task-item" data-id="${task.id}">
            <div class="task-content">
                <input type="checkbox" class="toggle-checkbox" ${task.completed ? "checked" : ""}>
                <span class="task-text ${task.completed ? "task-completed" : ""}">${task.text}</span>
            </div>
            <button class="delete-btn">X</button>
        </li>
    `).join("");
}

window.ui = {
    renderSystemStats,
    renderTasks
};