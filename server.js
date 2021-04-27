const inquirer = require("inquirer");
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password',
  database: 'employeeDB',
});

const startApp = () => {
    inquirer.prompt([
        {
            name: "startChoice",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add Department", "Add Role", "Add Employee", "View Departments, Roles, and Employees", "Update Employee Roles", "Exit"]
        }
    ]).then(answer => {
        // console.log(answer);
        switch(answer.startChoice) {
            case "Add Department":
                addDept()
                break;
            case "Add Role":
                addRole()
                break;
            case "Add Employee":
                addEmpl()
                break;
            case "View Departments, Roles, and Employees":
                viewAll()
                break;
            case "Update Employee Roles":
                updateEmplRole()
                break;
            case "Exit":
                console.log("Good Bye")
                break;
        };
    });
};

const addDept = () => {
    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message:"What department will you add?",
        }
    ]).then(({deptName}) => {
        connection.query("INSERT INTO department (name) VALUES (?)", deptName, (err,data) => {
            if (err) {
                throw err
            } else {
                console.log(`${deptName} Added`)
                connection.query("SELECT id AS 'ID', name AS 'Department Name' FROM department", (err, res) => {
                    if (err) {
                        throw err
                    } else {
                        console.table(res)
                        startApp();
                    };
                });
            }
        })
    })
};

const addRole = () => {
    connection.query("SELECT * FROM department", (err, deptData) => {
        const choices = deptData.map(dept => ({
            name:dept.name,
            value:dept.id
        }))
    
    inquirer.prompt([
        {
            name: "roleName",
            type: "input",
            message:"What role will you add?",
        },
        {
            name: "salary",
            type: "input",
            message:"Enter a salary for the role",
        },
        {
            name: "roleDept",
            type: "list",
            message:"Choose a department the role will be added to",
            choices: choices
        }
    ]).then(({roleName, salary, roleDept}) => {
        // INSERT INTO role SET ? , {title:roleName, salary, department_id:roleDept}
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [roleName, salary, roleDept], 
        (err,data) => {
            if (err) {
                throw err
            } else {
                console.log(`You added ${roleName} with a salary of ${salary} to ${roleDept}!!`)
                connection.query("SELECT title AS 'Title', salary AS 'Salary', department_id as 'Department' FROM role", (err, res) => {
                    if (err) {
                        throw err
                    } else {
                        console.table(res)
                        startApp();
                    };
                });
            }
        })
    })
});
};

const addEmpl = () => {
    connection.query("SELECT * FROM role", (err, roleData) => {
        const roleChoices = roleData.map(role => ({
            name:role.title,
            value:role.id
        }))
        // console.log(choices)
        connection.query("SELECT * FROM employee", (err, emplData) => {
            const emplChoices = emplData.map(employee => ({
                name:employee.first_name,
                value:employee.id
        }))
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message:"What is the employee's first name?"
        },
        {
            name: "lastName",
            type: "input",
            message:"What is the employee's last name?"
        },
        {
            name: "role",
            type: "list",
            message:"What is the employee's role?",
            choices: roleChoices
        },
        {
            name: "manager",
            type: "list",
            message:"Who is the employee's manager?",
            choices: emplChoices
        }
    ]).then(({firstName, lastName, role, manager}) => {
        // INSERT INTO role SET ? , {title:roleName, salary, department_id:roleDept}
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [firstName, lastName, role, manager], 
        (err,data) => {
            if (err) {
                throw err
            } else {
                console.log("Employee Added")
                // connection.query("SELECT first_name AS 'First Name', last_name AS 'Last Name', role_id as 'Role' FROM employee", (err, res) => {
                //     if (err) {
                //         throw err
                //     } else {
                //         console.table(res)
                //     };
                // });
                viewAll();
                startApp();
            }
        })
    })
});
})
};

const viewAll = () => {
    connection.query(`
    SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name,' ',manager.last_name) AS manager
    FROM
        employee
            LEFT JOIN role on employee.role_id = role.id
            LEFT JOIN department on role.department_id = department.id
            LEFT JOIN employee manager on manager.id = employee.manager_id`, (err, res) => {
                if (err) {
                    throw err
                } else {
                    console.table(res)
                    startApp()
                };
            }
    );
}

const updateEmplRole = () => {
    connection.query("SELECT * FROM employee", (err, employeeData) => {
        const employeechoices = employeeData.map(employee => ({
            name:employee.first_name,
            value:employee.id
        }))
    connection.query("SELECT * FROM role", (err, emplRoleData) => {
        const employeeRolechoices = emplRoleData.map(employeeRole => ({
            name:employeeRole.title,
            value:employeeRole.id
        }))


    inquirer.prompt([
        {
            name:"employeeName",
            type:"list",
            message:"Which employee do you want to update?",
            choices: employeechoices
        },
        {
            name:"newRole",
            type:"list",
            message:"Which role are you assigning to the selected employee?",
            choices: employeeRolechoices
        }
    ]).then(({employeeName, newRole}) => {
        connection.query("UPDATE employee SET employee.role_id = ? WHERE id = ?", [newRole, employeeName], 
        (err,data) => {
            if (err) {
                throw err
            } else {
                console.log("Updated employee's role")
                // connection.query("SELECT first_name AS 'First Name', last_name AS 'Last Name', role_id as 'Role' FROM employee", (err, res) => {
                //     if (err) {
                //         throw err
                //     } else {
                //         console.table(res)
                //     };
                // });
                // startApp();
                viewAll()
            }
        })
    })
    });
    });
}


connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  startApp();
});
