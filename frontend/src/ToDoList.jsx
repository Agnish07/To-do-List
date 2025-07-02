import React, { useState, useEffect } from 'react';
import axios from 'axios';
import catImage from './cat.png';

function ToDoList() {

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Fetch tasks from backend
    useEffect(() => {
        fetchTasks();
    }, []);

    function fetchTasks() {
        axios.get('http://localhost:4000/tasks') // Updated port
            .then(res => setTasks(res.data))
            .catch(err => console.error(err));
    }

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            axios.post('http://localhost:4000/tasks', { text: newTask }) // Updated port
                .then(() => {
                    fetchTasks();
                    setNewTask("");
                })
                .catch(err => console.error(err));
        }
    }

    function deleteTask(id) {
        axios.delete(`http://localhost:4000/tasks/${id}`) // Updated port
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
