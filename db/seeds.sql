USE company;

INSERT INTO department(id, name)
VALUES
(1, "Operations"),
(2, "Development"),
(3, "Sales"),
(4, "Marketing");

INSERT INTO roles(id, title, salary, department_id)
VALUES
(1, "Management", 200000, 1),
(2, "Director", 250000, 1),
(3, "Lyricist", 150000, 2),
(4, "Philosopher", 120000, 2),
(5, "Service", 25000, 3),
(6, "Production", 270000, 4),
(7, "Advertising", 300000, 4);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Wesley", "Snipes", 1, 1),
(2, "John", "Woo", 2, 2),
(3, "Method", "Man", 3, 3),
(4, "Huey", "Freeman", 4, 1),
(5, "Homer", "Simpson", 5, 2),
(6, "Sarah", "Connor", 6, 3),
(7, "Chris", "Farley", 7, 2),
(8, "Lloyd", "Christmas", 3, 3);