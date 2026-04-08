

const renewTasks = [
    {
        assignedTo: ['Anna Müller', 'Heinzi'],
        category: 'Technical Task',
        categoryColor: 'technical-task',
        currentTask: 'to-do',
        description: 'Implement the new authentication flow using JSON Web Tokens (JWT) for secure API requests.',
        dueDate: '2026-04-15',
        firebaseId: '-OpfA1_xbC3DEfGhIjkL',
        id: 1,
        priority: 'urgent',
        subtasks: [
            { current_state: 'closed', id: 0, subtask: 'Set up JWT middleware' },
            { current_state: 'open', id: 1, subtask: 'Create login and register endpoints' },
            { current_state: 'open', id: 2, subtask: 'Write unit tests for auth logic' }
        ],
        title: 'Authentication Flow Update'
    },
    {
        assignedTo: ['Hiroshi Tanaka'],
        category: 'User Story',
        categoryColor: 'user-story',
        currentTask: 'in-progress',
        description: 'Refactor the global CSS variables to support a dynamic dark mode toggle across all dashboard components.',
        dueDate: '2026-04-20',
        firebaseId: '-OqG2B_ycD4EFgHiJkLm',
        id: 2,
        priority: 'medium',
        subtasks: [
            { current_state: 'closed', id: 0, subtask: 'Define dark mode color palette' },
            { current_state: 'open', id: 1, subtask: 'Implement theme provider' }
        ],
        title: 'Implement Dark Mode'
    },
    {
        assignedTo: ['Jane Doe', 'John Doe'],
        category: 'Technical Task',
        categoryColor: 'technical-task',
        currentTask: 'await-feedback',
        description: 'Optimize database queries for the reporting module to reduce loading times for large datasets.',
        dueDate: '2026-04-12',
        firebaseId: '-OrH3C_zdE5FGhIjKlMn',
        id: 3,
        priority: 'low',
        subtasks: [
            { current_state: 'closed', id: 0, subtask: 'Identify slow queries with EXPLAIN' },
            { current_state: 'closed', id: 1, subtask: 'Add necessary database indexes' },
            { current_state: 'open', id: 2, subtask: 'Verify performance on staging' },
            { current_state: 'open', id: 3, subtask: 'Update API documentation' }
        ],
        title: 'Query Optimization'
    },
    {
        assignedTo: ['Juan Pérez'],
        category: 'Technical Task',
        categoryColor: 'technical-task',
        currentTask: 'to-do',
        description: 'Set up a basic CI/CD pipeline using GitHub Actions to automate testing on every pull request.',
        dueDate: '2026-04-25',
        firebaseId: '-OsI4D_aeF6GHiJkLmNo',
        id: 4,
        priority: 'urgent',
        subtasks: [
            { current_state: 'open', id: 0, subtask: 'Create workflow YAML file' }
        ],
        title: 'Setup CI Pipeline'
    },
    {
        assignedTo: ['Laura', 'Lisa Weber'],
        category: 'User Story',
        categoryColor: 'user-story',
        currentTask: 'done',
        description: 'Develop a responsive mobile navigation menu that works seamlessly on all screen sizes.',
        dueDate: '2026-04-05',
        firebaseId: '-OtJ5E_bfG7HIjKlMnOp',
        id: 5,
        priority: 'medium',
        subtasks: [
            { current_state: 'closed', id: 0, subtask: 'Design burger menu icon' },
            { current_state: 'closed', id: 1, subtask: 'Add animation transitions' },
            { current_state: 'closed', id: 2, subtask: 'Test on iOS and Android devices' }
        ],
        title: 'Mobile Navigation'
    },
    {
        assignedTo: ['Maria Musterfrau', 'Max Mustermann'],
        category: 'Technical Task',
        categoryColor: 'technical-task',
        currentTask: 'to-do',
        description: 'Migrate the legacy user profile data to the new schema in the production database.',
        dueDate: '2026-05-01',
        firebaseId: '-OuK6F_cgH8IJkLmNoPq',
        id: 6,
        priority: 'low',
        subtasks: [
            { current_state: 'open', id: 0, subtask: 'Write migration script' },
            { current_state: 'open', id: 1, subtask: 'Perform dry run on development' }
        ],
        title: 'Database Migration'
    }
];

async function fetchLastResetDate() {
    const url = `${BASE_URL}appState/lastResetDate.json`;
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
    return null;
}

async function updateLastResetDate(dateString) {
    const url = `${BASE_URL}appState/lastResetDate.json`;
    const payload = JSON.stringify(dateString);
    await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: payload
    });
}

async function checkIfToday() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const todayDateString = new Date(now.getTime() - offset).toISOString().split('T')[0];
    
    const savedDate = await fetchLastResetDate();
    
    
    if (todayDateString !== savedDate) {
        await startNewDay(todayDateString);
    }
}

async function startNewDay(dateString) {
    await resetTasksInFirebase(renewTasks);
    await updateLastResetDate(dateString);
    tasks = [...renewTasks];
    renderAllTasks(); 
}

async function resetTasksInFirebase(renewTasks) {
    const url = `${BASE_URL}tasks.json`;
    const payload = JSON.stringify(renewTasks);
    
    await fetch(url, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: payload
    });
}
