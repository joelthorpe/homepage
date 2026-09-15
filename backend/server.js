const express = require("express");
const cors = require("cors");
const si = require("systeminformation");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 8080;
const TODOS_FILE = path.join(__dirname, "data/todos.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Docs: https://www.npmjs.com/package/systeminformation
app.get("/api/system-info", async (req, res) => {
    try {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const time = await si.time();
        const net = await si.networkStats();
        const disk = await si.fsSize();

        // TODO: Grabs the main drive for now - make this more dynamic
        const mainDrive = disk[0] || { used: 0, size: 0, use: 0 }

        const uptimeSeconds = time.uptime;
        const d = Math.floor(uptimeSeconds / (3600 * 24));
        const h = Math.floor(uptimeSeconds % (3600 * 24) / 3600);
        const m = Math.floor(uptimeSeconds % 3600 / 60);
        const uptimeFormatted = `${d > 0 ? d + 'd ' : ''}${h > 0 ? h + 'h ' : ''}${m}m`;

        res.json({
            cpuLoad: cpu.currentLoad.toFixed(2),
            memUsed: (mem.used / 1024 / 1024 / 1024).toFixed(2),
            memTotal: (mem.total / 1024 / 1024 / 1024).toFixed(2),
            netRx: ((net[0]?.rx_sec || 0) / 1024 / 1024).toFixed(2),
            netTx: ((net[0]?.tx_sec || 0) / 1024 / 1024).toFixed(2),
            netStatus: net[0]?.operstate || 'unknown',
            storageUsed: (mainDrive.used / 1024 / 1024 / 1024).toFixed(2),
            storageTotal: (mainDrive.size / 1024 / 1024 / 1024).toFixed(2),
            storagePercent: mainDrive.use.toFixed(2),
            uptime: uptimeFormatted
        });
    } catch (error) {
        console.error("Error fetching system info:", error);
        res.status(500).json({ error: "Failed to fetch system info" });
    }
});

function getTodos() {
    try {
        const data = fs.readFileSync(TODOS_FILE, "utf8");
        const todos = JSON.parse(data);

        if (!Array.isArray(todos)) {
            throw new Error("Invalid tasks file: expected an array");
        }

        return todos;
    } catch (err) {
        if (err.code === "ENOENT") return [];
        throw err;
    }
}

function saveTodos(todos) {
    fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 4));
}

app.get("/api/todos", (req, res) => {
    res.json(getTodos());
});

app.post("/api/todos", (req, res) => {
    const text = req.body?.text;

    if (typeof text !== "string" || text.trim() === "") {
        return res.status(400).json({ error: "Invalid text provided: must be a non-empty string" });
    }

    const todos = getTodos();

    const newTask = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false
    };

    todos.push(newTask);
    saveTodos(todos);
    res.status(201).json(newTask);
});

app.delete("/api/todos/:id", (req, res) => {
    let todos = getTodos();
    todos = todos.filter(t => t.id !== req.params.id);
    saveTodos(todos);
    res.status(200).json({ success: true });
});

app.patch("/api/todos/:id/toggle", (req, res) => {
    let todos = getTodos();
    const task = todos.find(t => t.id === req.params.id);
    if (task) {
        task.completed = !task.completed;
        saveTodos(todos);
        res.status(200).json(task);
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});