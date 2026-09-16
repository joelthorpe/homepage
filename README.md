# Homepage Dashboard

A Node.js and Vanilla JavaScript web application for monitoring server system metrics, managing daily tasks, displaying local weather, and providing configurable shortcuts to self-hosted services. This project was built to demonstrate concepts learned during my first-year university DDS (Data-Driven Systems) module, alongside personal knowledge and exploration of RESTful APIs.

## Features
* **Monitor System:** Display real-time CPU load, memory usage, network traffic, storage, and uptime.
* **Manage Tasks:** Add, toggle, and delete daily tasks.
* **View Weather:** Fetch and display real-time weather data and dynamic icons via the Open-Meteo API.
* **Update Location:** Modify the location for the weather widget, saved via localStorage.
* **Data Persistence:** Automatically save and load tasks using a JSON file.
* **Configure Services:** Define categorised service shortcuts in a YAML file without changing the frontend code.

## Concepts Demonstrated
* Client-server architecture
* RESTful API integration
* Asynchronous JavaScript (fetch, async/await)
* DOM manipulation
* JSON file I/O operations
* YAML configuration parsing
* Client-side localStorage
* Separation of concerns

## Project Structure
The application is separated into a backend server and a static frontend, with each file responsible for a specific part of the system:

```text
server-homepage/
├── backend/
│   ├── data/
│   │   ├── services.yaml
│   │   └── todos.json
│   ├── package.json
│   └── server.js
└── public/
    ├── index.html
    ├── css/
    │   └── style.css
    ├── data/
    │   └── wmo_codes.json
    └── js/
        ├── api.js
        ├── main.js
        └── ui.js
```

* **`server.js`** - Handles the server, API proxy, and system hardware metrics.
* **`services.yaml`** - Defines the categories and links displayed in the services section.
* **`todos.json`** - Stores persistent user tasks.
* **`index.html`** - Provides the main dashboard structure.
* **`style.css`** - Manages application styling and layout.
* **`wmo_codes.json`** - Maps weather codes to descriptions and icons.
* **`api.js`** - Provides reusable methods for API requests.
* **`main.js`** - Manages polling intervals and user interaction.
* **`ui.js`** - Handles DOM manipulation and UI rendering.

## Technologies Used
* Node.js / Express
* Vanilla HTML, CSS, JavaScript
* systeminformation package
* js-yaml package
* Open-Meteo API
* Git / GitHub

## How to Run
1. Clone this repository.
2. Open a terminal and navigate to the `backend/` directory.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the backend server.
5. Open your browser and navigate to `http://localhost:8080`.

## Configuring Services
Services are configured in `backend/data/services.yaml`. Each category contains one or more services with a name, icon, address, description, server, and container value:

```yaml
- Media:
    - Example Service:
        icon: https://placehold.co/128x128
        href: https://[IP_ADDRESS]:[PORT]
        description: Example Description
        server: local-docker
        container: example-container
```

Changes to this file are loaded automatically when the dashboard refreshes its service list.

## Future Improvements
- [x] Integrate real-time system metrics
- [x] Add task list persistence
- [x] Implement weather API proxying
- [x] Add editable weather location
- [x] Generate service shortcuts from a YAML configuration file
- [ ] Display availability states for services, such as online, offline, or unreachable
- [ ] Add metric widgets to configured services
