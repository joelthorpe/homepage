const express = require("express");
const cors = require("cors");
const si = require("systeminformation");
const path = require("path");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});