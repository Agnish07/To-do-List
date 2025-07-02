#To-Do-List
This is a full-stack To-Do List application built using:

🖼️ Frontend: React (Vite)

🛠️ Backend: Node.js, Express

🗂️ Database: MongoDB

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
Node.js and npm installed

MongoDB running locally or on MongoDB Atlas

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
Method	Endpoint	Description
GET	/tasks	Get all tasks
POST	/tasks	Add a new task
DELETE	/tasks/:id	Delete a task

📸 Features
✅ Add new tasks

✅ Delete tasks

✅ Move tasks up or down

✅ React frontend using Vite

✅ Express.js backend with MongoDB

✅ REST API architecture

📚 Technologies Used
Frontend: React, Vite, Axios

Backend: Node.js, Express, Mongoose

Database: MongoDB

🚀 Future Improvements
Task completion toggle (checkbox)

User authentication

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

