import React, { useState, useEffect } from 'react';
import axios from 'axios';
import catImage from './cat.png';

// ✅ Your Render backend URL
const BASE_URL = 'https://to-do-list-h9gt.onrender.com';

axios.get(`${BASE_URL}/tasks`)
axios.post(`${BASE_URL}/tasks`, { text: newTask })
axios.delete(`${BASE_URL}/tasks/${id}`)

function ToDoList() {

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Fetch tasks from backend when the component loads
    useEffect(() => {
        fetchTasks();
    }, []);

    function fetchTasks() {
        axios.get(`${BASE_URL}/tasks`)
            .then(res => setTasks(res.data))
            .catch(err => console.error(err));
    }

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            axios.post(`${BASE_URL}/tasks`, { text: newTask })
                .then(() => {
                    fetchTasks();
                    setNewTask("");
                })
                .catch(err => console.error(err));
        }
    }

    function deleteTask(id) {
        axios.delete(`${BASE_URL}/tasks/${id}`)
            .then(() => fetchTasks())
            .catch(err => console.error(err));
    }

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    return (
        <>
            <div className="todolist">
                <h1>My To Do List</h1>
                <br />
                <img src={catImage} alt="cat" className='cat-image' />

                <div>
                    <input
                        type="text"
                        placeholder='Enter task :)'
                        value={newTask}
                        onChange={handleInputChange}
                    />

                    <button className="add-button" onClick={addTask}>Add Task</button>
                </div>

                <ol>
                    {tasks.map((task, index) =>
                        <li key={task._id}>
                            <span className="text">{task.text}</span>
                            <button className="delete-button"
                                onClick={() => deleteTask(task._id)}>
                                Delete</button>

                            <button className="move-button"
                                onClick={() => moveTaskUp(index)}>
                                Move 🐱👆🏻</button>

                            <button className="move-button"
                                onClick={() => moveTaskDown(index)}>
                                Move 🐱👇🏻</button>

                        </li>
                    )}
                </ol>

            </div>
        </>
    )
}

export default ToDoList;
