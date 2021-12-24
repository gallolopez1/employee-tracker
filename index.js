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
        "View Departments",
        "View Department Budget",
        "Add Role",
        "View Roles",
        "Add Employee",
        "View Employees",
        "Update Employees",
        "Update Employee's Manager",
      ],
    })
    .then((answer) => {
      switch (answer.options) {
        case "Add Department":
          promptDepartments();
          break;
        case "View Departments":
          viewDepartments().then((data) => {
            console.table(data);
            return options();
          });
          break;
        case "View Department Budget":
          viewDepartmentBudget().then((data) => {
            console.table(data);
            return options();
          });
          break;
        case "Add Role":
          promptRoles();
          break;
        case "View Roles":
          viewRoles().then((data) => {
            console.table(data);
            return options();
          });
          break;
        case "Add Employee":
          promptEmployees();
          break;
        case "View Employees":
          viewEmployees().then((data) => {
            console.table(data);
            return options();
          });
          break;
        case "Update Employees":
          updateEmployee();
          break;
        case "Update Employee's Manager":
          updateEmployeeManager();
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

// view department budget
const viewDepartmentBudget = () => {
  const sql = `SELECT departments.name AS 'Department', SUM(roles.salary) AS 'Total Budget'
  from employees
  LEFT JOIN roles on employees.role_id = roles.id
  LEFT JOIN departments on roles.department_id = departments.id
  GROUP BY departments.name`;
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
  let allDepartment = [];
  viewDepartments().then((data) => {
    data.forEach((dept) => {
      allDepartment.push(dept);
    });
  });
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
        type: "list",
        name: "departmentID",
        message: "Which department does the role belong to? (Required)",
        choices: allDepartment,
      },
      // pass the new values into the database
    ])
    .then((answersRole) => {
      let deptID = allDepartment.find((department) => {
        if (department.name === answersRole.departmentID) {
          return department;
        }
      }).id;
      const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
      const params = [answersRole.roleTitle, answersRole.roleSalary, deptID];
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
const promptEmployees = () => {
  let allRole = [];
  let allEmployees = [];
  viewRoles().then((data) => {
    data.forEach((roles) => {
      let newObj = {
        id: roles.id,
        name: roles.title,
      };
      allRole.push(newObj);
    });
  });
  viewEmployees().then((data) => {
    data.forEach((employee) => {
      let newObj = {
        id: employee.id,
        name: employee.first_name + " " + employee.last_name,
      };
      allEmployees.push(newObj);
    });
  });
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
        type: "rawlist",
        name: "employeeRole",
        message: "What is the employee's role? (Required)",
        choices: allRole,
      },
      {
        type: "rawlist",
        name: "employeeManager",
        message: "Who is the employee's manager? (Required)",
        choices: allEmployees,
      }, // pass the new values into the database
    ])
    .then((answersEmployee) => {
      let roleID = allRole.find((role) => {
        if (role.name === answersEmployee.employeeRole) {
          return role;
        }
      }).id;
      let managerID = allEmployees.find((manager) => {
        if (manager.name === answersEmployee.employeeManager) {
          return manager;
        }
      }).id;
      const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
      const params = [
        answersEmployee.employeeFirstName,
        answersEmployee.employeeLastName,
        roleID,
        managerID,
      ];
      db.query(sql, params, (err) => {
        if (err) {
          console.log("Failed to insert employee into the database.");
          return options();
        } else {
          console.log("Added new employee to the Database!");
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

// Update Employee
// Prompt question to update empoloyee
const updateEmployee = () => {
  let allRole = [];
  let allEmployees = [];
  viewRoles().then((data) => {
    data.forEach((roles) => {
      let newObj = {
        id: roles.id,
        name: roles.title,
      };
      allRole.push(newObj);
    });
  });
  viewEmployees()
    .then((data) => {
      data.forEach((employee) => {
        let newObj = {
          id: employee.id,
          name: employee.first_name + " " + employee.last_name,
        };
        allEmployees.push(newObj);
      });
    })
    .then(() => {
      console.log(`
    ==================
    Update an Employee
    ==================`);
      return inquirer
        .prompt([
          {
            type: "rawlist",
            name: "employee",
            message: "Which employee would you like to update? (Required)",
            choices: allEmployees,
          },
          {
            type: "rawlist",
            name: "role_id",
            message:
              "Which employee's role would you like to update? (Required)",
            choices: allRole,
          },
        ])
        .then((update) => {
          let employeeID = allEmployees.find((manager) => {
            if (manager.name === update.employee) {
              return manager;
            }
          }).id;
          let roleID = allRole.find((role) => {
            if (role.name === update.role_id) {
              return role;
            }
          }).id;
          const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
          const params = [roleID, employeeID];
          db.query(sql, params, (err) => {
            if (err) {
              console.log("Failed to update employee role.");
              return options();
            } else {
              console.log("Updated employee role!");
              return options();
            }
          });
        });
    });
};

// Update employee manager
const updateEmployeeManager = () => {
  let allEmployees = [];
  viewEmployees()
    .then((data) => {
      data.forEach((employee) => {
        let newObj = {
          id: employee.id,
          name: employee.first_name + " " + employee.last_name,
        };
        allEmployees.push(newObj);
      });
    })
    .then(() => {
      return inquirer
        .prompt([
          {
            type: "rawlist",
            name: "employee",
            message: "Which employee do you want to update? (Required)",
            choices: allEmployees,
          },
          {
            type: "rawlist",
            name: "manager",
            message: "Select a manager for this employee. (Required)",
            choices: allEmployees,
          },
        ])
        .then((answer) => {
          let employeeID = allEmployees.find(id => {
            if (id.name === answer.employee) {
              return id;
            }
          }).id;
          let managerID = allEmployees.find(id => {
            if (id.name === answer.manager) {
              return id;
            }
          }).id;
          const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
          const params = [managerID, employeeID];
          db.query(sql, params, (err) => {
            if (err) {
              console.log("Failed to update employee's manager.");
              return options();
            } else {
              console.log("Updated employee's manager!");
              return options();
            }
          });
        });
    });
};

options();
