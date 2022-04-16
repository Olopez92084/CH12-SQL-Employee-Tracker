const inquirer = require("inquirer");
const db = require("../db");
require("console.table");

// module.exports.choices = [
//   { name: "View all employees", value: module.exports.employee.viewEmployees },
//   { name: "Add an employee", value: module.exports.employee.addEmployee },
// { name: "Update an employee role", value: module.exports.employee.updateEmployeeRole },
//   { name: "Update employee manager", value: module.exports.employee.updateEmployeeManager },
// { name: "View employees by manager", value: module.exports.employee.viewByManager },
//   { name: "Delete an employee", value: module.exports.employee.deleteEmployee },
// ];

module.exports.viewEmployees = function (mainMenu) {
  db.findAllEmployees().then(([rows]) => {
    console.table(rows);
    return mainMenu();
  });
};

const mapEmployeeChoices = function ({ id, name }) {
  return { name, value: id };
};
module.exports.addEmployee = async function (mainMenu) {
  const [rowsA] = await db.findAllRoles();
  console.table(rowsA);
  const roleChoices = rowsA.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  console.log(roleChoices);

  const [rowsB] = await db.findAllEmployees();
  const employeeChoices = rowsB.map(mapEmployeeChoices);
  console.log(employeeChoices);

  const managerChoices = [...employeeChoices, { name: "Null" }];
  console.log(managerChoices);
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
      validate: validateInput,
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
      validate: validateInput,
    },
    {
      type: "list",
      name: "role_id",
      message: "What is this employee's role?",
      choices: roleChoices,
    },
    {
      type: "confirm",
      name: "managerOrNot",
      message: "Does this employee have a manager?",
      default: true,
    },
    {
      type: "list",
      name: "manager_id",
      when: function (answers) {
        return answers.managerOrNot === true;
      },
      message: "Who is this employee's manager?",
      choices: managerChoices,
    },
  ]);
  delete answer.managerOrNot;
  console.log(answer);
  db.addAnEmployee(answer).then(() => {
    db.findAllEmployees().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

module.exports.updateEmployeeRole = async function (mainMenu) {
  const [rowsA] = await db.findAllRoles();
  console.table(rowsA);
  const roleChoices = rowsA.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  console.log(roleChoices);

  const [rowsB] = await db.findAllEmployees();
  const employeeChoices = rowsB.map(mapEmployeeChoices);
  console.log(employeeChoices);
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices,
    },
    {
      type: "list",
      name: "role",
      message: "What is this employee's new role?",
      choices: roleChoices,
    },
  ]);
  console.log(answer);
  db.updateAnEmployeeRole(answer.role, answer.employee).then(() => {
    db.findAllEmployees().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

module.exports.updateEmployeeManager = async function (mainMenu) {
  const [rowsB] = await db.findAllEmployees();
  const employeeChoices = rowsB.map(mapEmployeeChoices);
  console.log(employeeChoices);
  const { employee } = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's manager do you want to update?",
      choices: employeeChoices,
    },
  ]);
  const [managerRows] = await db.findAllManagers(employee);
  console.table(managerRows);
  const managerChoices = managerRows.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  managerChoices.push({ name: "No manager selected", value: null });

  const { manager } = await inquirer.prompt([
    {
      type: "list",
      name: "manager",
      message: "Who is this employee's new manager?",
      choices: managerChoices,
    },
  ]);
  db.updateAnEmployeeManager(manager, employee).then(() => {
    db.findAllEmployees().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

module.exports.viewByManager = async function (mainMenu) {
  const [allEmployees] = await db.findAllEmployees();
  const managerChoices = allEmployees.map(mapEmployeeChoices);
  const { manager } = await inquirer.prompt([
    {
      type: "list",
      name: "manager",
      message: "Which manager's employees do you want to see?",
      choices: managerChoices,
    },
  ]);
  const [managersEmployees] = await db.findByManager(manager);
  console.table(managersEmployees);
  return mainMenu();
};

module.exports.deleteEmployee = async function (mainMenu) {
  const [rowsA] = await db.findAllEmployees();
  console.table(rowsA);
  const employeeChoices = rowsA.map(({ id, name }) => ({ name, value: id }));
  console.table(employeeChoices);
  const response = await inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee do you want to delete?",
        choices: employeeChoices,
      },
    ])
    .then((response) => {
      db.deleteAnEmployee(response.employee);
      db.findAllEmployees().then(([rows]) => {
        console.table(rows);
        return mainMenu();
      });
    });
};

function validateInput(value) {
  if (value) {
    return true;
  } else {
    console.log("\n Please enter a value");
    return false;
  }
}