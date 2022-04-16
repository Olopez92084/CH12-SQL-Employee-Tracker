const inquirer = require("inquirer");
const db = require("./db");
require("console.table");

const employee = require("./controllers/employee");
const department = require("./controllers/department");
const role = require("./controllers/role");

const exit = () => {
  console.log("Bye!");
  process.exit(0);
};
const mainMenu = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        { name: "View all departments", value: department.viewDepartments.bind(null, mainMenu) },
        { name: "View all roles", value: role.viewRoles.bind(null, mainMenu) },
        { name: "View all employees", value: employee.viewEmployees.bind(null, mainMenu) },
        { name: "Add a department", value: department.addDepartment.bind(null, mainMenu) },
        { name: "Add a role", value: role.addRole.bind(null, mainMenu) },
        { name: "Add an employee", value: employee.addEmployee.bind(null, mainMenu) },
        { name: "Update an employee role", value: employee.updateEmployeeRole.bind(null, mainMenu) },
        { name: "Update employee manager", value: employee.updateEmployeeManager.bind(null, mainMenu) },
        { name: "View employees by manager", value: employee.viewByManager.bind(null, mainMenu) },
        { name: "View employees by department", value: department.viewByDepartment.bind(null, mainMenu) },
        { name: "Delete a department", value: department.deleteDepartment.bind(null, mainMenu) },
        { name: "Delete a role", value: role.deleteRole.bind(null, mainMenu) },
        { name: "Delete an employee", value: employee.deleteEmployee.bind(null, mainMenu) },
        { name: "View total utilized budget by department", value: department.budgetByDepartment.bind(null, mainMenu) },
        { name: "Exit", value: exit },
      ],
    },
  ]);

  answer.menu();
};

mainMenu();
