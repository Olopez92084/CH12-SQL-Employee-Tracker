const inquirer = require("inquirer");
const db = require("../db");
require("console.table");

// module.exports.choices = [
//     { name: "View all departments", value: module.exports.viewDepartments },
//     { name: "Add a department", value: module.exports.addDepartment },
// { name: "View employees by department", value: module.exports.viewByDepartment },
//     { name: "Delete a department", value: module.exports.deleteDepartment },
//     { name: "View total utilized budget by department", value: module.exports.budgetByDepartment, },
// ];

module.exports.viewDepartments = function (mainMenu) {
  db.findAllDepartments().then(([rows]) => {
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

module.exports.addDepartment = async function (mainMenu) {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What's the department's name?",
      validate: validateInput,
    },
  ]);

  const departmentName = answer.name;
  db.addADepartment(departmentName).then(() => {
    db.findAllDepartments().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

module.exports.viewByDepartment = async function (mainMenu) {
  const [allDepartments] = await db.findAllDepartments();
  console.table(allDepartments);
  const departmentChoices = allDepartments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const { department } = await inquirer.prompt([
    {
      type: "list",
      name: "department",
      message: "Which department's employees do you want to see?",
      choices: departmentChoices,
    },
  ]);
  const [departmentEmployees] = await db.findByDepartment(department);
  console.table(departmentEmployees);
  return mainMenu();
};

module.exports.deleteDepartment = async function (mainMenu) {
  const [allDepartments] = await db.findAllDepartments();
  console.table(allDepartments);
  const departmentChoices = allDepartments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  console.table(departmentChoices);
  const { department } = await inquirer.prompt([
    {
      type: "list",
      name: "department",
      message: "Which department do you want to delete?",
      choices: departmentChoices,
    },
  ]);

  db.deleteADepartment(department).then(() => {
    db.findAllDepartments().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

module.exports.budgetByDepartment = async function (mainMenu) {
  const [departmentBudget] = await db.findDepartmentBudget();
  console.table(departmentBudget);
  return mainMenu();
};
