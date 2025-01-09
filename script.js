class TodoList {
    constructor() {
        this.tasks = this.loadTasks();
        this.setupEventListeners();
        this.render();
        this.checkDate();
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        const savedDate = localStorage.getItem('lastDate');
        
        // Reset tasks if it's a new day
        if (savedDate !== new Date().toDateString()) {
            return {
                high: [],
                other: []
            };
        }
        
        return savedTasks ? JSON.parse(savedTasks) : {
            high: [],
            other: []
        };
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('lastDate', new Date().toDateString());
    }

    checkDate() {
        setInterval(() => {
            const currentDate = new Date().toDateString();
            if (localStorage.getItem('lastDate') !== currentDate) {
                this.tasks = {
                    high: [],
                    other: []
                };
                this.saveTasks();
                this.render();
            }
        }, 60000); // Check every minute
    }

    addTask(text, priority = 'other') {
        if (priority === 'high' && this.tasks.high.length >= 2) {
            alert('High priority list can only have 2 items!');
            return false;
        }

        const task = {
            id: Date.now(),
            text,
            completed: false
        };

        this.tasks[priority].push(task);
        this.saveTasks();
        this.render();
        return true;
    }

    toggleTask(id) {
        ['high', 'other'].forEach(priority => {
            const task = this.tasks[priority].find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
            }
        });
        this.saveTasks();
        this.render();
    }

    clearTasks() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            this.tasks = {
                high: [],
                other: []
            };
            this.saveTasks();
            this.render();
        }
    }

    setupEventListeners() {
        document.getElementById('add-task').addEventListener('click', () => {
            const text = prompt('Enter task:');
            if (text) {
                const modal = document.getElementById('priority-modal');
                modal.style.display = 'flex';

                const handlePriority = (priority) => {
                    this.addTask(text, priority);
                    modal.style.display = 'none';
                };

                document.getElementById('high-priority-btn').onclick = () => handlePriority('high');
                document.getElementById('low-priority-btn').onclick = () => handlePriority('other');
            }
        });

        document.getElementById('clear-tasks').addEventListener('click', () => {
            this.clearTasks();
        });
    }

    editTask(id, priority) {
        const task = this.tasks[priority].find(t => t.id === id);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText && newText.trim() !== '') {
                task.text = newText.trim();
                this.saveTasks();
                this.render();
            }
        }
    }

    render() {
        const highList = document.getElementById('high-priority');
        const otherList = document.getElementById('everything-else');

        highList.innerHTML = '';
        otherList.innerHTML = '';

        const renderTask = (task, priority) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => this.toggleTask(task.id));

            const text = document.createElement('span');
            text.textContent = task.text;
            text.className = 'task-text';
            text.addEventListener('click', (e) => {
                if (!task.completed) {  // Only allow editing if task is not completed
                    this.editTask(task.id, priority);
                }
            });

            li.appendChild(checkbox);
            li.appendChild(text);
            return li;
        };

        this.tasks.high.forEach(task => {
            highList.appendChild(renderTask(task, 'high'));
        });

        this.tasks.other.forEach(task => {
            otherList.appendChild(renderTask(task, 'other'));
        });
    }
}

// Initialize the app
const todoList = new TodoList(); 