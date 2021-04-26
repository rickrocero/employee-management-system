DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR (30) NOT NULL,  
  PRIMARY KEY (id)
);

INSERT INTO department (name) 
VALUES ("Sales"), 
       ("Engineering"), 
       ("Legal"), 
       ("Finance");




CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", "100000", 1), 
       ("Salesperson", "80000", 1), 
       ("Lead Engineer", "150000", 2), 
       ("Software Engineer", "120000", 2), 
       ("Accountant", "125000", 4), 
       ("Legal Team Lead", "250000", 3), 
       ("Lawyer", "190000", 3);




CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES role(id) 
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Hermione", "Granger", 1, NULL), 
       ("Harry", "Potter", 2, 1), 
       ("Ron", "Weasley", 3, NULL), 
       ("Draco", "Malfoy", 4, 3), 
       ("Tom", "Riddle", 5, NULL), 
       ("Severus", "Snape", 6, NULL), 
       ("Albus", "Dumbledore", 7, 6), 
       ("Dobby", "Free-elf", 2, 1);

SELECT * FROM employee;