const readline = require('readline');
const fs = require('fs');
const chalk = require('chalk');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let tasks = [];

// Step 2: User Input
async function getUserInput(prompt) {
  return new Promise((resolve) => {
    rl.question(chalk.green(prompt), (answer) => {
      resolve(answer.trim());
    });
  });
}

// Step 3: Task Management
function addTask(description) {
  tasks.push({ description, completed: false });
}

function markTaskComplete(taskIndex) {
  if (taskIndex >= 0 && taskIndex < tasks.length) {
    tasks[taskIndex].completed = true;
  }
}

// Step 4: Viewing the List
function displayTasks() {
  console.log(chalk.bold.blue("Tasks:"));
  tasks.forEach((task, index) => {
    const status = task.completed ? chalk.green("[x]") : chalk.red("[ ]");
    console.log(`${index + 1}. ${status} ${task.description}`);
  });
}

// Step 5: File Handling
async function saveTasksToFile() {
  try {
    const data = JSON.stringify(tasks, null, 2);
    await fs.promises.writeFile('tasks.json', data);
    console.log(chalk.green('Tasks saved to tasks.json.'));
  } catch (err) {
    console.error(chalk.red('Error saving tasks to file:', err));
  }
}

async function loadTasksFromFile() {
  try {
    const data = await fs.promises.readFile('tasks.json', 'utf8');
    tasks = JSON.parse(data);
    console.log(chalk.green('Tasks loaded from tasks.json.'));
  } catch (err) {
    console.error(chalk.red('Error loading tasks from file:', err));
  }
}

// Step 7: Testing
async function main() {
  await loadTasksFromFile();

  while (true) {
    console.log("\nOptions:");
    console.log(chalk.cyan("1. Add Task"));
    console.log(chalk.cyan("2. Mark Task as Complete"));
    console.log(chalk.cyan("3. View Tasks"));
    console.log(chalk.cyan("4. Save Tasks to File"));
    console.log(chalk.cyan("5. Exit"));

    const choice = await getUserInput(chalk.yellow("Enter your choice: "));

    switch (choice) {
      case "1":
        const taskDescription = await getUserInput(chalk.green("Enter task description: "));
        addTask(taskDescription);
        break;

      case "2":
        const taskIndex = parseInt(await getUserInput(chalk.green("Enter task index to mark as complete: "))) - 1;
        markTaskComplete(taskIndex);
        break;

      case "3":
        displayTasks();
        break;

      case "4":
        await saveTasksToFile();
        break;

      case "5":
        await saveTasksToFile();
        console.log(chalk.blue("Exiting."));
        rl.close();
        return;

      default:
        console.log(chalk.red("Invalid choice. Please try again."));
    }
  }
}

// Step 7: Testing
main();

