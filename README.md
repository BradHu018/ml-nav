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
