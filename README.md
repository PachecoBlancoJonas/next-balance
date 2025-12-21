# Next_Balance

#### Video Demo: <URL HERE>

#### Description:

**Next_Balance** is a robust web application designed to simplify personal finance management by centralizing banking information. In an era where individuals often hold accounts across multiple financial institutions, tracking expenses and balances can become a fragmented and tedious process. Next_Balance addresses this by providing a unified dashboard where users can view transactions and balances from various bank accounts in one place.

The core functionality of the application relies on the secure integration of the **GoCardless Bank Account Data API**. This allows the application to connect to thousands of banks across Europe and beyond, fetching real-time data regarding accounts, balances, and transaction history. The project is built using a modern full-stack architecture, utilizing **Node.js** and **Express** for the backend, **React** with **Vite** for the frontend, and **MariaDB** for data persistence.

The application allows users to register, securely log in, select their country and bank, and authorize the retrieval of their financial data. Once connected, the data is stored locally in the database to allow for fast retrieval and historical analysis without constantly polling the banking provider.

### File Structure and Functionality

The project is organized into a clear client-server architecture (`/frontend` and `/backend`). Below is a breakdown of the key files and directories:

#### Backend (`/backend`)
*   **`server.js` / `app.js`**: The entry point of the backend application. It configures the Express server, sets up CORS (Cross-Origin Resource Sharing) to allow the frontend to communicate with the backend, initializes cookie parsers, and defines the base API routes (`/user` and `/gocardless`).
*   **`src/controllers/`**: Contains the logic for handling HTTP requests.
    *   **`userController.js`**: Manages user-centric operations such as registration, login, logout, and retrieving user-specific account data from the local database.
    *   **`gocardlessController.js`**: Handles the complex logic required to interact with the GoCardless API. This includes generating access tokens, fetching lists of banks based on the country, creating requisitions (links for users to authorize access), and fetching transactions.
*   **`src/middleware/`**: Contains intermediate functions to protect routes.
    *   **`verifyUser.js`**: Validates the user's session. It intercepts requests to protected routes, checks for the presence of a valid JWT (JSON Web Token) in the cookies, verifies its signature, and decodes the user ID.
    *   **`verifyGocardless.js`**: Ensures that the user has a valid access token for the GoCardless API before attempting to fetch banking data. It handles token refreshing logic if the API token has expired.
*   **`src/services/`**: Abstracts the database logic. This layer interacts directly with MariaDB, executing SQL queries. This separation of concerns keeps the controllers clean.
*   **`src/db/index.js`**: Manages the connection pool to the MariaDB database.
*   **`create_db.sh`**: A Bash script designed to automate the deployment process. It sets up the database schema, creates necessary tables (`users`, `accounts`, `transactions`, `countries`), and creates the database user with the specific privileges required for the app to run securely.

#### Frontend (`/frontend`)
*   **`src/main.js`**: The entry point for the React application/Vite build.
*   **`src/context/`**: Contains the **AuthContext**. This is used to manage the global state of the user (e.g., whether they are logged in and their profile data).
*   **`src/pages/`**: Represents the different views of the application (e.g., Login, Dashboard, Bank Selection).
*   **`src/components/`**: Reusable UI elements used to build the pages.

### Design Choices

#### 1. Security Architecture (JWT and Cookies)
Security was a primary concern during the development of Next_Balance, particularly regarding authentication.
*   **JWT (JSON Web Tokens):** I chose JWTs for handling user sessions because they are stateless. This means the server does not need to store session files in memory or the database, making the application scalable.
*   **HTTP-Only Cookies:** Instead of storing the JWT in `localStorage` (which is vulnerable to Cross-Site Scripting or XSS attacks), the token is sent to the client as an **HTTP-Only cookie**. This ensures that client-side JavaScript cannot read the token, significantly reducing the risk of token theft.
*   **SQL Injection Prevention:** The backend service layer uses parameterized queries (or an ORM approach) when interacting with MariaDB. This ensures that user input is treated as data, not executable code, effectively neutralizing SQL injection vectors during registration and login.

#### 2. React Context for State Management
I opted to use **React Context** rather than external libraries like Redux. The application's state requirements—primarily the authenticated user object and their login status—are global but not excessively complex. Redux would have introduced unnecessary boilerplate code. Context provides a clean, native way to avoid "prop drilling" (passing data down through many layers of components) and ensures that the navigation bar and protected routes always have access to the current user's status.

#### 3. Database Choice (MariaDB)
MariaDB was selected for its reliability, performance, and SQL compliance. Given the relational nature of the data (Users have Accounts, Accounts have Transactions, Transactions belong to Categories), a relational database was the logical choice over NoSQL solutions. The data integrity provided by foreign keys ensures that if a user is deleted, their sensitive financial data is cleanly removed or handled according to cascading rules.

### Installation and Setup

To run this project locally, you must configure the environment variables and the database.

1.  **Database Setup:**
    *   Ensure MariaDB is installed.
    *   Run the provided shell script to initialize the database and tables:
        ```bash
        ./create_db.sh
        ```

2.  **Environment Variables:**
    *   **Backend:** Create a `.env` file in the `/backend` directory. You must include your database credentials, the JWT secret key, and your GoCardless API keys (`SECRET_ID`, `SECRET_KEY`).
    *   **Frontend:** Create a `.env` file in the `/frontend` directory containing the `VITE_API_URL` pointing to your backend server.

3.  **Dependencies:**
    *   Navigate to `/backend` and run `npm install`.
    *   Navigate to `/frontend` and run `npm install`.

4.  **Running the App:**
    *   Start the backend: `npm start` (in `/backend`).
    *   Start the frontend: `npm run dev` (in `/frontend`).