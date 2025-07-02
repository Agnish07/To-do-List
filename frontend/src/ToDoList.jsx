import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './App.css';
import catImage from './cat.png';

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    function fetchTasks() {
        axiosInstance.get('/tasks')
            .then(res => setTasks(res.data))
            .catch(err => console.error('Error fetching tasks:', err));
    }

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
    if (newTask.trim() !== "") {
        console.log('Sending task to backend:', newTask); // ✅ Add this to debug
        axiosInstance.post('/tasks', { text: newTask })
            .then((res) => {
                console.log('Task added successfully:', res.data); // ✅ Check this appears
                fetchTasks();
                setNewTask("");
            })
            .catch(err => console.error('Error adding task:', err));
    }
    console.log('Backend URL:', axiosInstance.defaults.baseURL);

}


    function deleteTask(id) {
        axiosInstance.delete(`/tasks/${id}`)
            .then(() => fetchTasks())
            .catch(err => console.error('Error deleting task:', err));
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
        <div className="todolist">
            <h1>My To Do List</h1>
            <img src={catImage} alt="cat" className = "cat-image"/>

            <div>
                <input
                    type="text"
                    placeholder="Enter task :)"
                    value={newTask}
                    onChange={handleInputChange}
                />
                <button className="add-button" onClick={addTask}>Add Task</button>
            </div>

            <ol>
                {tasks.map((task, index) => (
                    <li key={task._id}>
                        <span className="text">{task.text}</span>
                        <button className="delete-button" onClick={() => deleteTask(task._id)}>Delete</button>
                        <button className="move-button" onClick={() => moveTaskUp(index)}>Move Up ⬆️</button>
                        <button className="move-button" onClick={() => moveTaskDown(index)}>Move Down ⬇️</button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ToDoList;
