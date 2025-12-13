document.addEventListener("DOMContentLoaded", () => {

    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');

    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');

    const backendUrl = "http://localhost:8080/users/darshan/todos";

    let tasks = [];
    let currentFilter = 'all';
    let backendAvailable = true;

    async function checkBackend() {
        try {
            const res = await fetch(backendUrl, { method: "GET" });
            backendAvailable = res.ok;
        } catch {
            backendAvailable = false;
        }
    }

    async function loadTodos() {
        if (!backendAvailable) {
            renderTasks();
            return;
        }

        try {
            const res = await fetch(backendUrl);
            tasks = await res.json();
            renderTasks();
        } catch {
            backendAvailable = false;
            renderTasks();
        }
    }

    async function addTask(text) {
        const trimmed = text.trim();
        if (!trimmed) return;

        if (!backendAvailable) {
            tasks.unshift({
                id: Date.now(),
                description: trimmed,
                done: false
            });
            renderTasks();
            taskInput.value = "";
            return;
        }

        try {
            const res = await fetch(backendUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: "darshan",
                    description: trimmed,
                    targetDate: new Date().toISOString().split("T")[0],
                    done: false
                })
            });

            if (!res.ok) throw new Error();
            await loadTodos();
            taskInput.value = "";
        } catch {
            backendAvailable = false;
            addTask(trimmed);
        }
    }

    async function toggleDone(task) {
        task.done = !task.done;

        if (!backendAvailable) {
            renderTasks();
            return;
        }

        try {
            await fetch(`${backendUrl}/${task.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task)
            });
        } catch {
            backendAvailable = false;
        }
    }

    async function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();

        if (!backendAvailable) return;

        try {
            await fetch(`${backendUrl}/${id}`, { method: "DELETE" });
        } catch {
            backendAvailable = false;
        }
    }

    function renderTasks() {
        taskList.innerHTML = "";

        tasks.forEach(task => {
            if (currentFilter === 'active' && task.done) return;
            if (currentFilter === 'completed' && !task.done) return;

            const li = document.createElement("li");
            if (task.done) li.classList.add("completed");

            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = task.done;
            cb.onchange = () => toggleDone(task);

            const label = document.createElement("label");
            label.textContent = task.description;
            label.style.marginLeft = "10px";

            const del = document.createElement("button");
            del.textContent = "Delete";
            del.className = "deleteBtn";
            del.onclick = () => deleteTask(task.id);

            li.append(cb, label, del);
            taskList.appendChild(li);
        });
    }

    function setFilter(f) {
        currentFilter = f;
        document.querySelectorAll('.filterBtn')
            .forEach(b => b.classList.remove('active'));
        document.getElementById(f + "Btn").classList.add('active');
        renderTasks();
    }

    addBtn.onclick = () => addTask(taskInput.value);
    taskInput.onkeydown = e => e.key === "Enter" && addTask(taskInput.value);

    allBtn.onclick = () => setFilter('all');
    activeBtn.onclick = () => setFilter('active');
    completedBtn.onclick = () => setFilter('completed');

    checkBackend().then(loadTodos);

});
