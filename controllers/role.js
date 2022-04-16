const inquirer = require("inquirer");
const db = require("../db");
require("console.table");

// module.exports.choices = [
//     { name: "View all roles", value: module.exports.role.viewRoles },
//     { name: "Add a role", value: module.exports.role.addRole },
// { name: "Update an employee role", value: module.exports.employee.updateEmployeeRole },
//     { name: "Delete a role", value: module.exports.role.deleteRole },
// ];

module.exports.addRole = async function (mainMenu) {
  const [rows] = await db.findAllDepartments();
  console.table(rows);
  const departmentChoices = rows.map(({ name, id }) => ({ name, value: id }));

  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the title for this role?",
      validate: validateInput,
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary for this role?",
      validate: validateInput,
    },
    {
      type: "list",
      name: "department",
      message: "Which department for this role?",
      choices: departmentChoices,
    },
  ]);

  db.addARole(answer.name, answer.salary, answer.department).then(() => {
    db.findAllRoles().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

module.exports.deleteRole = async function (mainMenu) {
  const [rowsA] = await db.findAllRoles();
  console.table(rowsA);
  const roleChoices = rowsA.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  console.log(roleChoices);
  const response = await inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "Which role do you want to delete?",
        choices: roleChoices,
      },
    ])
    .then((response) => {
      db.deleteARole(response.role);
      db.findAllRoles().then(([rows]) => {
        console.table(rows);
        return mainMenu();
      });
    });
};

module.exports.viewRoles = function (mainMenu) {
    db.findAllRoles().then(([rows]) => {
      console.table(rows);
      return mainMenu();
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