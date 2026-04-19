const renewTasks = [
  {
    assignedTo: ["Paul Becker", "Sarah Hoffmann"],
    category: "Technical Task",
    categoryColor: "technical-task",
    currentTask: "in-progress",
    description:
      "Implement the new authentication flow using JSON Web Tokens (JWT) for secure API requests.",
    dueDate: "2026-04-15",
    firebaseId: "-OpfA1_xbC3DEfGhIjkL",
    id: 1,
    priority: "urgent",
    subtasks: [
      { current_state: "closed", id: 0, subtask: "Set up JWT middleware" },
      { current_state: "open", id: 1, subtask: "Create login and register endpoints" },
      { current_state: "open", id: 2, subtask: "Write unit tests for auth logic" },
    ],
    title: "Authentication Flow Update",
  },
  {
    assignedTo: ["Daniel Klein"],
    category: "User Story",
    categoryColor: "user-story",
    currentTask: "in-progress",
    description:
      "Refactor the global CSS variables to support a dynamic dark mode toggle across all dashboard components.",
    dueDate: "2026-04-20",
    firebaseId: "-OqG2B_ycD4EFgHiJkLm",
    id: 2,
    priority: "medium",
    subtasks: [
      { current_state: "closed", id: 0, subtask: "Define dark mode color palette" },
      { current_state: "open", id: 1, subtask: "Implement theme provider" },
    ],
    title: "Implement Dark Mode",
  },
  {
    assignedTo: ["Nina Schulz", "Felix Wagner"],
    category: "Technical Task",
    categoryColor: "technical-task",
    currentTask: "await-feedback",
    description:
      "Optimize database queries for the reporting module to reduce loading times for large datasets.",
    dueDate: "2026-04-12",
    firebaseId: "-OrH3C_zdE5FGhIjKlMn",
    id: 3,
    priority: "low",
    subtasks: [
      { current_state: "closed", id: 0, subtask: "Identify slow queries with EXPLAIN" },
      { current_state: "closed", id: 1, subtask: "Add necessary database indexes" },
      { current_state: "open", id: 2, subtask: "Verify performance on staging" },
      { current_state: "open", id: 3, subtask: "Update API documentation" },
    ],
    title: "Query Optimization",
  },
  {
    assignedTo: ["Lea Bauer"],
    category: "Technical Task",
    categoryColor: "technical-task",
    currentTask: "await-feedback",
    description:
      "Set up a basic CI/CD pipeline using GitHub Actions to automate testing on every pull request.",
    dueDate: "2026-04-25",
    firebaseId: "-OsI4D_aeF6GHiJkLmNo",
    id: 4,
    priority: "urgent",
    subtasks: [
      { current_state: "open", id: 0, subtask: "Create workflow YAML file" },
    ],
    title: "Setup CI Pipeline",
  },
  {
    assignedTo: ["Emma Krüger", "Tobias Krause"],
    category: "User Story",
    categoryColor: "user-story",
    currentTask: "done",
    description:
      "Develop a responsive mobile navigation menu that works seamlessly on all screen sizes.",
    dueDate: "2026-04-05",
    firebaseId: "-OtJ5E_bfG7HIjKlMnOp",
    id: 5,
    priority: "medium",
    subtasks: [
      { current_state: "closed", id: 0, subtask: "Design burger menu icon" },
      { current_state: "closed", id: 1, subtask: "Add animation transitions" },
      { current_state: "closed", id: 2, subtask: "Test on iOS and Android devices" },
    ],
    title: "Mobile Navigation",
  },
  {
    assignedTo: ["Lukas Meier", "Anna Fuchs"],
    category: "Technical Task",
    categoryColor: "technical-task",
    currentTask: "to-do",
    description:
      "Migrate the legacy user profile data to the new schema in the production database.",
    dueDate: "2026-05-01",
    firebaseId: "-OuK6F_cgH8IJkLmNoPq",
    id: 6,
    priority: "low",
    subtasks: [
      { current_state: "open", id: 0, subtask: "Write migration script" },
      { current_state: "open", id: 1, subtask: "Perform dry run on development" },
    ],
    title: "Database Migration",
  },
  {
    assignedTo: ["Paul Becker", "Sarah Hoffmann", "Daniel Klein", "Nina Schulz", "Felix Wagner", "Lea Bauer"],
    category: "Technical Task",
    categoryColor: "technical-task",
    currentTask: "in-progress",
    description:
      "Develop and test a script to migrate the legacy database schema to the new PostgreSQL structure efficiently.",
    dueDate: "2026-05-10",
    firebaseId: "-OqgC3_zdE5FGiHjKkMn",
    id: 7,
    priority: "medium",
    subtasks: [
      { current_state: "closed", id: 0, subtask: "Backup legacy database" },
      { current_state: "closed", id: 1, subtask: "Design new table relationships" },
      { current_state: "open", id: 2, subtask: "Write data extraction script" },
      { current_state: "open", id: 3, subtask: "Implement data transformation logic" },
      { current_state: "open", id: 4, subtask: "Create data loading functions" },
      { current_state: "open", id: 5, subtask: "Execute test migration on staging" },
      { current_state: "open", id: 6, subtask: "Verify data integrity post-migration" },
    ],
    title: "Database Schema Migration Script",
  },
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
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });
}

async function checkIfToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const todayDateString = new Date(now.getTime() - offset)
    .toISOString()
    .split("T")[0];

  const savedDate = await fetchLastResetDate();

  if (todayDateString !== savedDate) {
    await startNewDay(todayDateString);
  }
}

async function startNewDay(dateString) {
  await resetDataInFirebase("tasks", renewTasks, "firebaseId");
  await resetDataInFirebase("users", renewUsers);

  await updateLastResetDate(dateString);

  tasks = [...renewTasks];
  users = [...renewUsers];

  sortTodoforDate();
  setTaskSummaryInformation();
}

async function resetDataInFirebase(path, dataArray, keyField = null) {
  const url = `${BASE_URL}${path}.json`;

  let dataObject = {};

  for (let i = 0; i < dataArray.length; i++) {
    const item = dataArray[i];
    if (keyField && item[keyField]) {
      dataObject[item[keyField]] = item;
    } else {
      const generatedKey = generateFirebaseLikeId();
      dataObject[generatedKey] = item;
    }
  }

  const payload = JSON.stringify(dataObject);

  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });
}

function generateFirebaseLikeId() {
  return "-" + Math.random().toString(36).substr(2, 20);
}

const renewUsers = [
  {
    avatarColor: "rgba(255, 99, 132, 1)",
    email: "paul.becker@gmail.com",
    name: "Paul Becker",
    password: "paulbecker123",
    phone: "0151 22334455",
  },
  {
    avatarColor: "rgba(54, 162, 235, 1)",
    email: "sarah.hoffmann@gmail.com",
    name: "Sarah Hoffmann",
    password: "sarahhoffmann123",
    phone: "0176 99887766",
  },
  {
    avatarColor: "rgba(255, 206, 86, 1)",
    email: "daniel.klein@gmail.com",
    name: "Daniel Klein",
    password: "danielklein123",
    phone: "0152 44556677",
  },
  {
    avatarColor: "rgba(75, 192, 192, 1)",
    email: "nina.schulz@gmail.com",
    name: "Nina Schulz",
    password: "ninaschulz123",
    phone: "0177 11223344",
  },
  {
    avatarColor: "rgba(153, 102, 255, 1)",
    email: "felix.wagner@gmail.com",
    name: "Felix Wagner",
    password: "felixwagner123",
    phone: "0160 77889900",
  },
  {
    avatarColor: "rgba(255, 159, 64, 1)",
    email: "lea.bauer@gmail.com",
    name: "Lea Bauer",
    password: "leabauer123",
    phone: "0159 66778899",
  },
  {
    avatarColor: "rgba(199, 199, 199, 1)",
    email: "jonas.lang@gmail.com",
    name: "Jonas Lang",
    password: "jonaslang123",
    phone: "0175 33445566",
  },
  {
    avatarColor: "rgba(83, 102, 255, 1)",
    email: "emma.krueger@gmail.com",
    name: "Emma Krüger",
    password: "emmakrueger123",
    phone: "0157 88990011",
  },
  {
    avatarColor: "rgba(255, 99, 255, 1)",
    email: "tim.roth@gmail.com",
    name: "Tim Roth",
    password: "timroth123",
    phone: "0178 22334455",
  },
  {
    avatarColor: "rgba(0, 200, 150, 1)",
    email: "lena.schmidt@gmail.com",
    name: "Lena Schmidt",
    password: "lenaschmidt123",
    phone: "0151 55667788",
  },
  {
    avatarColor: "rgba(120, 50, 200, 1)",
    email: "marc.neumann@gmail.com",
    name: "Marc Neumann",
    password: "marcneumann123",
    phone: "0176 44332211",
  },
  {
    avatarColor: "rgba(10, 180, 255, 1)",
    email: "julia.hahn@gmail.com",
    name: "Julia Hahn",
    password: "juliahahn123",
    phone: "0152 99887766",
  },
  {
    avatarColor: "rgba(255, 140, 0, 1)",
    email: "sebastian.voigt@gmail.com",
    name: "Sebastian Voigt",
    password: "sebastianvoigt123",
    phone: "0177 55664433",
  },
  {
    avatarColor: "rgba(60, 179, 113, 1)",
    email: "melanie.koch@gmail.com",
    name: "Melanie Koch",
    password: "melaniekoch123",
    phone: "0160 11223344",
  },
  {
    avatarColor: "rgba(220, 20, 60, 1)",
    email: "philipp.busch@gmail.com",
    name: "Philipp Busch",
    password: "philippbusch123",
    phone: "0159 33445566",
  },
  {
    avatarColor: "rgba(65, 105, 225, 1)",
    email: "sophie.frank@gmail.com",
    name: "Sophie Frank",
    password: "sophiefrank123",
    phone: "0175 66778899",
  },
  {
    avatarColor: "rgba(34, 139, 34, 1)",
    email: "lukas.meier@gmail.com",
    name: "Lukas Meier",
    password: "lukasmeier123",
    phone: "0157 22334455",
  },
  {
    avatarColor: "rgba(255, 20, 147, 1)",
    email: "anna.fuchs@gmail.com",
    name: "Anna Fuchs",
    password: "annafuchs123",
    phone: "0178 99887766",
  },
  {
    avatarColor: "rgba(0, 191, 255, 1)",
    email: "tobias.krause@gmail.com",
    name: "Tobias Krause",
    password: "tobiaskrause123",
    phone: "0151 66778899",
  },
  {
    avatarColor: "rgba(255, 215, 0, 1)",
    email: "carina.otto@gmail.com",
    name: "Carina Otto",
    password: "carinaotto123",
    phone: "0176 44556677",
  },
];
