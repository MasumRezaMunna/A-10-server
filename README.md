# MovieMaster Pro

**Live Client Site URL:** []
**Live Server Site URL:** []

A comprehensive movie management system where users can browse, manage, and organize their favorite movies with advanced filtering and personal collections.



## 🚀 Key Features

* **Full Authentication:** Secure user registration and login using email/password and Google Sign-In, managed with Firebase.
* **Complete Movie CRUD:** Users can **C**reate (add), **R**ead (view), **U**pdate (edit), and **D**elete their own movie entries.
* **Personalized "My Collection" Page:** A private, user-specific page that displays only the movies they have personally added, with quick edit/delete actions.
* **Advanced Filtering & Search:** The "All Movies" page features a robust filtering system to find movies by genre (multi-select), rating range, and a case-insensitive title search.
* **Watchlist Functionality:** Users can add any movie to a personal "My Watchlist" page to save it for later viewing.
* **Persistent Theme Toggle:** A responsive light/dark mode theme toggle that saves the user's preference in `localStorage`.
* **Secure Private Routes:** Client-side routing is protected, ensuring users cannot access private pages (like "My Collection") without being logged in, even on a page reload.



## 🛠️ Technology Stack

### Client-Side (Frontend)
* **React:** For building the user interface.
* **React Router:** For client-side routing and navigation.
* **TailwindCSS:** For utility-first styling.
* **DaisyUI:** A Tailwind component library for beautiful, pre-built UI elements.
* **Firebase:** For user authentication and session management.
* **Axios:** For making HTTP requests to the backend server.
* **React Hot Toast:** For clean, non-blocking toast notifications.

### Server-Side (Backend)
* **Node.js:** As the JavaScript runtime environment.
* **Express.js:** As the web application framework for building the REST API.
* **MongoDB:** As the NoSQL database to store movie and user data.
* **CORS:** To enable cross-origin resource sharing between the client and server.
* **Dotenv:** To manage environment variables securely.
