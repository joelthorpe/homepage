# Homepage Dashboard

A Node.js and Vanilla JavaScript web application for monitoring server system metrics, managing daily tasks, displaying local weather, and providing configurable shortcuts to self-hosted services. This project was built to demonstrate concepts learned during my first-year university DDS (Data-Driven Systems) module, alongside personal knowledge and exploration of RESTful APIs.

## Features
* **Monitor System:** Display real-time CPU load, memory usage, network traffic, storage, and uptime.
* **Manage Tasks:** Add, toggle, and delete daily tasks.
* **View Weather:** Fetch and display real-time weather data and dynamic icons via the Open-Meteo API.
* **Update Location:** Modify the location for the weather widget, saved via localStorage.
* **Data Persistence:** Automatically save and load tasks using a JSON file.
* **Configure Services:** Define categorised service shortcuts in a YAML file without changing the frontend code.
* **Monitor Services:** Display Docker container and health states on configured service cards.
* **Display Service Metrics:** Fetch and display selected API values on individual service cards.
* **Docker Deployment:** Build and run the application using Docker Compose.

## Concepts Demonstrated
* Client-server architecture
* RESTful API integration
* Asynchronous JavaScript (fetch, async/await)
* DOM manipulation
* JSON file I/O operations
* YAML configuration parsing
* Client-side localStorage
* Docker Engine API integration
* Containerisation with Docker Compose
* Separation of concerns

## Project Structure
The application is separated into a backend server and a static frontend, with each file responsible for a specific part of the system:

```text
server-homepage/
├── .dockerignore
├── backend/
│   ├── data/
│   │   ├── services.yaml
│   │   └── todos.json
│   ├── package.json
│   └── server.js
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
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
* **`Dockerfile`** - Defines the container image used to run the application.
* **`docker-compose.yml`** - Configures the application container, data volume, ports, and Docker socket.
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
* dockerode package
* Open-Meteo API
* Docker / Docker Compose
* Git / GitHub

## How to Run
### Using Node.js
1. Clone this repository.
2. Open a terminal and navigate to the `backend/` directory.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the backend server.
5. Open your browser and navigate to `http://localhost:8080`.

### Using Docker Compose
1. Clone this repository.
2. Open a terminal and navigate to the project directory.
3. Run `docker compose -f docker/docker-compose.yml up -d --build`.
4. Open your browser and navigate to `http://localhost:8080`.

The Docker socket is mounted into the application container so that Dockerode can request container states from the Docker Engine API. Access to this socket is privileged and should only be provided to trusted containers.

## Configuring Services
Services are configured in `backend/data/services.yaml`. Each category contains one or more services with a name, icon, address, description, server, and container value. Services can also include an optional widget configuration for displaying values from an API:

```yaml
- Media:
    - Example Service:
        icon: https://placehold.co/128x128
        href: http://:8096
        description: Example Description
        server: local-docker
        container: example-container
        widget:
            type: example-widget
            url: http://[IP_ADDRESS]:[PORT]/api/endpoint
            key: "[API_KEY]"
            fields:
                - label: "Example Stat 1"
                  path: "example.value_one"
                - label: "Example Stat 2"
                  path: "example.value_two"
```

Setting `server` to `local-docker` allows the backend to inspect the named container and display its current state. If the container provides a Docker health check, its health state is displayed instead. Service states are refreshed every 30 seconds.

Service links can use a complete URL or the current dashboard hostname. For example, `:9000` uses the dashboard protocol and hostname, while `http://:9000` and `https://:9000` use the selected protocol with the current hostname. This allows the same configuration to work when the dashboard is accessed from a different device or address.

The widget `url` defines the API endpoint requested by the backend. The optional `key` value is sent using the `X-API-Key` header, while custom headers can be provided using a `headers` object. Each field contains a label and a path to the required value in the returned JSON. Nested values can be selected using dot notation, such as `example.value_one`.

Widget API keys and headers are used only by the backend and are not included in the service data returned to the browser.

Changes to this file are loaded automatically when the dashboard refreshes its service list.

## Future Improvements
- [x] Integrate real-time system metrics
- [x] Add task list persistence
- [x] Implement weather API proxying
- [x] Add editable weather location
- [x] Generate service shortcuts from a YAML configuration file
- [x] Display Docker container and health states for configured services
- [x] Add metric widgets to configured services
- [ ] Load widget credentials from environment variables
