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
            choices: ["Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Roles"]
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
            case "View Departments":
                viewDepts()
                break;
            case "View Roles":
                viewRoles()
                break;
            case "View Employees":
                viewEmpls()
                break;
            case "Update Employee Roles":
                updateEmplRole()
                break;
        };
    });
//   connection.query('SELECT * FROM products', (err, res) => {
//     if (err) throw err;
//     console.log(res);
//     connection.end();
//   });
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
                console.log(`You added ${deptName}!!`)
                connection.query("SELECT * FROM department", (err, res) => {
                    if (err) {
                        throw err
                    } else {
                        console.table(res)
                    };
                });
                startApp();
            }
        })
    })
};



connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  startApp();
});
