# Accessibility Tool

This project is a full-stack web application designed to scan websites for accessibility issues, providing reports to help developers create more inclusive web experiences.

## Project Structure

This project uses a monorepo structure with a separate frontend and backend:

-   `/frontend`: A React application built with Vite that provides the user interface for initiating scans and viewing results.
-   `/backend`: A Node.js and Express API that handles scan requests, processes URLs with Axe-core, and stores scan history.

---

## Getting Started

### Prerequisites

-   Node.js (v20.x or later recommended)
-   npm
-   A running MongoDB instance.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd accessbility-tool
    ```

2.  **Configure Backend:**
    -   Navigate to the backend directory: `cd backend`
    -   Create a `.env` file by copying the example: `cp .env.example .env` (You may need to create `.env.example` first).
    -   Update the `.env` file with your MongoDB connection string and other environment variables.
    -   Install dependencies: `npm install`

3.  **Configure Frontend:**
    -   Navigate to the frontend directory: `cd ../frontend`
    -   Install dependencies: `npm install`

### Running the Application

1.  **Start the Backend Server:**
    -   From the `/backend` directory:
    ```bash
    npm run dev
    ```
    The API will be running on the port specified in your `.env` file (e.g., `http://localhost:5000`).

2.  **Start the Frontend Development Server:**
    -   From the `/frontend` directory:
    ```bash
    npm run dev
    ```
    The React application will be available at `http://localhost:5173` (or another port if 5173 is busy).

---

## CI/CD

This repository is configured with a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically runs on every push and pull request to the `main` branch.

The workflow performs the following checks:
-   **Backend CI**: Installs dependencies and runs the `build` script for the Node.js backend.
-   **Frontend CI**: Installs dependencies and runs the `build` script for the React frontend.

This ensures that code committed to the repository is always in a buildable state.
