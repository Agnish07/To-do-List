#To-Do-List
This is a full-stack To-Do List application built using:

🖼️ Frontend: React (Vite)

🛠️ Backend: Node.js, Express

🗂️ Database: SQLite (via Node's built-in node:sqlite)

It allows users to:

Add tasks

Delete tasks

Reorder tasks (move up/down)

📂 Project Structure
text
Copy
Edit
TO-DO-LIST/
├── backend/       # Express server
│   ├── server.js
│   └── package.json
├── frontend/      # React frontend (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
🚀 Getting Started
📦 Prerequisites
Node.js 22.5+ and npm installed (SQLite is built into Node — nothing to install or run separately)

🔐 Environment Variables

Create `backend/.env` (see `backend/.env.example`):

```
JWT_SECRET=<a long random string>
PORT=4000
```

The database is a single file at `backend/todolist.db`, created automatically on first start. It is gitignored. To reset everything, stop the server and delete that file.

Create `frontend/.env` (see `frontend/.env.example`):

```
VITE_BACKEND_URL=http://localhost:4000
```

The server refuses to start without `JWT_SECRET`, since a missing secret would make login tokens forgeable.

⚙️ Backend Setup (Express API)
Navigate to the backend folder:

bash
Copy
Edit
cd backend
Install dependencies:

bash
Copy
Edit
npm install
Start the backend server:

bash
Copy
Edit
node server.js
The backend will run at:

arduino
Copy
Edit
http://localhost:4000
🎨 Frontend Setup (React Vite)
Navigate to the frontend folder:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Start the frontend development server:

bash
Copy
Edit
npm run dev
The frontend will typically run at:

arduino
Copy
Edit
http://localhost:5173
🔗 API Endpoints

Auth:

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/signup | Create an account, returns a JWT |
| POST | /auth/login | Log in, returns a JWT |
| GET | /auth/me | Current user (requires token) |

Tasks (all require `Authorization: Bearer <token>`):

| Method | Endpoint | Description |
|---|---|---|
| GET | /tasks | Get the logged-in user's tasks |
| POST | /tasks | Add a new task |
| DELETE | /tasks/:id | Delete one of your own tasks |

📸 Features
✅ Email + password signup and login (JWT)

✅ Each user only sees their own tasks

✅ Add new tasks

✅ Delete tasks

✅ Move tasks up or down

✅ React frontend using Vite

✅ Express.js backend with SQLite

✅ REST API architecture

📚 Technologies Used
Frontend: React, Vite, Axios

Backend: Node.js, Express, bcryptjs, jsonwebtoken

Database: SQLite (node:sqlite)

🚀 Future Improvements
Task completion toggle (checkbox)

Password reset

Persist task reordering

Task categories

Cloud deployment (Vercel, Render)

🧑‍💻 Author
Agnish Bangal
GitHub: @Agnish07

🌟 How to Contribute
Fork the repository.

Create a new branch.

Make your changes.

Submit a pull request.

