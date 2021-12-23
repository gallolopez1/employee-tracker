const inquirer = require("inquirer");
const db = require('./db/connection');
require('console.table');

// Select what do you want to do
const options = () => {
  return inquirer.prompt({
      type: "list",
      name: "options",
      message: "What would you like to do",
      choices: [
        "Add Department",
        "View Department",
        "Add Role",
        "View Role",
        "Add Employee",
        "View Employee",
        "Update Employee"]
    })
    .then((answer) => {
      switch (answer.options) {
        case "Add Department":
          promptDepartments();
          break;
        case "View Department":
          viewDepartments().then(data => {
            console.table(data);
          });
          break;
        case "Add Role":
          promptRoles();
          break;
        case "View Role":
          viewRoles();
          break;
        case "Add Employee":
          promptEmployee();
          break;
        case "View Employee":
          viewEmployee();
          break;
        case "Update Employee":
          promptUpdateEmployee();
          break;
      }
    });
};

// prompt information for department
const promptDepartments = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of the department? (Required)",
      validate: (departmentNameInput) => {
        if (departmentNameInput) {
          return true;
        } else {
          console.log("Please enter a department name!");
          return false;
        }
      },
    },
  ]);
};

// view all departments
const viewDepartments = () => {
    const sql = `SELECT * FROM departments`;
    var result = db.promise().query(sql).then(([rows, columns]) => {
        return rows;
    });
    return result;
}

// prompt information for roles
const promptRoles = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "roleTitle",
      message: "What is the name of the role? (Required)",
      validate: (roleTitleInput) => {
        if (roleTitleInput) {
          return true;
        } else {
          console.log("Please enter a role title!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "roleSalary",
      message: "What is the salary of the role? (Required)",
      validate: (roleSalaryInput) => {
        if (roleSalaryInput) {
          return true;
        } else {
          console.log("Please enter a role salary!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "departmentID",
      message: "Which department does the role belong to? (Required)",
      validate: (departmentIDInput) => {
        if (departmentIDInput) {
          return true;
        } else {
          console.log("Please enter a department ID!");
          return false;
        }
      },
    },
  ]);
};

// prompt information for employees
const promptEmployee = (employeeData) => {
  console.log(`
  =================
  Add a New Employee
  =================`);
  // If there's no 'employee' array property, create one
  if (!employeeData.employees) {
    employeeData.employees = [];
  }
  return inquirer.prompt([
    {
      type: "input",
      name: "employeeFirstName",
      message: "What is the employee's first name? (Required)",
      validate: (employeeFirstNameInput) => {
        if (employeeFirstNameInput) {
          return true;
        } else {
          console.log("Please enter a first name!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "employeeLastName",
      message: "What is the employee's last name? (Required)",
      validate: (employeeLastNameInput) => {
        if (employeeLastNameInput) {
          return true;
        } else {
          console.log("Please enter a last name!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "employeeRole",
      message: "What is the employee's role? (Required)",
      validate: (employeeLastNameInput) => {
        if (employeeLastNameInput) {
          return true;
        } else {
          console.log("Please enter a role!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "employeeManager",
      message: "What is the employee's manager? (Required)",
      validate: (employeeManagerInput) => {
        if (employeeManagerInput) {
          return true;
        } else {
          console.log("Please enter a manager!");
          return false;
        }
      },
    },
  ]);
};

options();