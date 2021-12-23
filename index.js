const inquirer = require("inquirer");
const db = require("./db/connection");
require("console.table");

// Prompt user to choose what they want to do
const options = () => {
  return inquirer
    .prompt({
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
        "Update Employee",
      ],
    })
    .then((answer) => {
      switch (answer.options) {
        case "Add Department":
          promptDepartments();
          break;
        case "View Department":
          viewDepartments().then((data) => {
            console.table(data);
            return options();
          });
          break;
        case "Add Role":
          promptRoles();
          break;
        case "View Role":
          viewRoles().then((data) => {
            console.table(data);
            return options();
          });
          break;
        case "Add Employee":
          promptEmployees();
          break;
        case "View Employee":
          viewEmployees().then((data) => {
            console.table(data);
            return options();
          });
          break;
        case "Update Employee":
          promptUpdateEmployee();
          break;
      }
    });
};

// prompt information for department
const promptDepartments = () => {
  console.log(`
  ====================
  Add a New Department
  ====================`);
  return inquirer
    .prompt(
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
      }
      // pass the new values into the database
    )
    .then((answersDept) => {
      const sql = `INSERT INTO departments (name) VALUES (?)`;
      const params = [answersDept.departmentName];
      db.query(sql, params, (err) => {
        if (err) {
          console.log(
            `Failed to insert ${answersDept.departmentName} into the database.`
          );
          return options();
        } else {
          console.log(`Added ${answersDept.departmentName} to the Database!`);
          return options();
        }
      });
    });
};

// view all departments
const viewDepartments = () => {
  const sql = `SELECT * FROM departments`;
  var result = db
    .promise()
    .query(sql)
    .then(([rows, columns]) => {
      return rows;
    });
  return result;
};

// prompt information for roles
const promptRoles = () => {
  console.log(`
  ==============
  Add a New Role
  ==============`);
  return inquirer
    .prompt([
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
      // pass the new values into the database
    ])
    .then((answersRole) => {
      const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
      const params = [
        answersRole.roleTitle,
        answersRole.roleSalary,
        answersRole.departmentID,
      ];
      db.query(sql, params, (err) => {
        if (err) {
          console.log(
            `Failed to insert ${answersRole.roleTitle} into the database.`
          );
          return options();
        } else {
          console.log(`Added ${answersRole.roleTitle} to the Database!`);
          return options();
        }
      });
    });
};

// view all roles
const viewRoles = () => {
  const sql = `SELECT roles.id, roles.title, roles.salary, departments.name
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id`;
  var result = db
    .promise()
    .query(sql)
    .then(([rows, columns]) => {
      return rows;
    });
  return result;
};

// prompt information for employees
const promptEmployees = (employeeData) => {
  console.log(`
  ==================
  Add a New Employee
  ==================`);
  return inquirer
    .prompt([
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
        message: "Who is the employee's manager? (Required)",
        validate: (employeeManagerInput) => {
          if (employeeManagerInput) {
            return true;
          } else {
            console.log("Please enter a manager!");
            return false;
          }
        },
      }, // pass the new values into the database
    ])
    .then((answersEmployee) => {
      const sql = `INSERT INTO roles (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
      const params = [
        answersEmployee.employeeFirstName,
        answersEmployee.employeeLastName,
        answersEmployee.employeeRole,
        answersEmployee.employeeManager,
      ];
      db.query(sql, params, (err) => {
        if (err) {
          console.log(
            'Failed to insert employee into the database.'
          );
          return options();
        } else {
          console.log('Added new employee to the Database!');
          return options();
        }
      });
    });
};

// view all empoloyees
const viewEmployees = () => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, 
    (SELECT CONCAT(x.first_name, " ", x.last_name) FROM employees x WHERE x.id = employees.manager_id) AS 'Manager'
    FROM employees
    LEFT JOIN roles ON roles.id = employees.role_id
    LEFT JOIN departments ON roles.department_id = departments.id`;
  var result = db
    .promise()
    .query(sql)
    .then(([rows, columns]) => {
      return rows;
    });
  return result;
};

options();
