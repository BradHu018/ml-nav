# ML Navigator

ML Navigator is a full-stack Mobile Legends: Bang Bang companion web app that helps players explore hero statistics, tier rankings, recommended builds, emblems, tips, and community-created builds.

The project combines a React frontend with a Node/Express backend and MySQL database to support user authentication, protected build creation, community build sharing, and dynamic build filtering.

## Features

### Hero and Game Information

- Browse Mobile Legends hero-related content through a clean React interface.
- View recommended builds, emblems, and gameplay tips.
- Explore a tier list based on win rate, pick rate, and ban rate logic.
- Use role-based and hero-based organization to make game data easier to understand.

### Community Builds

- Users can create custom hero builds with:
  - Hero name
  - Build name
  - Description
  - Emblem
  - Battle spell
  - 6 selected equipment items
- Community builds can be displayed and searched by hero.
- Builds are sorted to prioritize stronger or more popular community submissions.
- Each build includes creator credit through username display.

### Authentication

- User signup and login with secure password hashing.
- JWT-based authentication for protected backend routes.
- Logged-in users can create, update, and delete their own builds.

### Backend and Database

- REST API built with Express.
- MySQL database stores users, saved builds, and build items.
- Uses relational tables with foreign keys and cascading deletes.
- Build creation uses transactions to keep saved builds and their items consistent.

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MySQL
- mysql2/promise
- bcrypt
- JSON Web Tokens
- dotenv
- CORS

### Tools

- MySQL Workbench
- Thunder Client / Postman
- Git / GitHub
- npm / nodemon

## Project Structure

```txt
ml-navigator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── BuildCard.jsx
│   │   │   ├── HeroStats.jsx
│   │   │   ├── Emblems.jsx
│   │   │   ├── RecommendedBuilds.jsx
│   │   │   └── Tips.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── CommunityBuildsPage.jsx
│   │   │   └── TierListPage.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── buildController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── buildRoutes.js
│   ├── server.js
│   ├── .env
│   └── package.json

## Database Design
The backend uses a relational MySQL schema.

### `users`
Stores registered user accounts.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### `saved_builds`
store user-created builds
```sql
CREATE TABLE saved_builds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  hero_name VARCHAR(255) NOT NULL,
  build_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  emblem VARCHAR(255) NOT NULL,
  battle_spell VARCHAR(255) NOT NULL,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

### `build_items`
store the 6 equipment items for each build
```sql
CREATE TABLE build_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  build_id INT NOT NULL,
  slot_number INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  FOREIGN KEY (build_id) REFERENCES saved_builds(id) ON DELETE CASCADE
);

API Overview
Auth Routes
POST /api/auth/signup
POST /api/auth/login

Build Routes
POST   /api/builds
GET    /api/builds/my-builds
GET    /api/builds/community
GET    /api/builds/search?hero=HeroName
PUT    /api/builds/:id
DELETE /api/builds/:id

Example Build Request
{
  "hero_name": "Alucard",
  "build_name": "Lifesteal Burst",
  "description": "High damage lifesteal build for jungle Alucard",
  "emblem": "Fighter",
  "battle_spell": "Retribution",
  "build_items": [
    "Tough Boots",
    "War Axe",
    "Endless Battle",
    "Blade of Despair",
    "Queen's Wings",
    "Immortality"
  ]
}

Setup Instructions
1. Clone the repository
git clone <your-repo-url>
cd ml-navigator
2. Install backend dependencies
cd backend
npm install
3. Create backend .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ml_navigator
DB_PORT=3306
PORT=5000
JWT_SECRET=your_jwt_secret
4. Start the backend
npm run dev

The backend runs on:

http://localhost:5000
5. Install frontend dependencies
cd ../frontend
npm install
6. Start the frontend
npm run dev

The frontend runs on:

http://localhost:5173

