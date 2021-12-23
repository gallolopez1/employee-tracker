INSERT INTO departments (name)
VALUES
  'Sales',
  'Engineering',
  'Finance',
  'Legal';

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Salesperson', '80000', 1),
  ('Lead Engineer', '150000', 2),
  ('Software Engineer', '120000', 2),
  ('Account Manager', '160000', 3),
  ('Accountant', '125000', 3),
  ('Legal Team Lead', '250000', 4),
  ('Lawyer', '190000', 4),
  ;
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Mike', 'Chan', 1, NULL),
  ('Ashley', 'Rodriguez', 2, 1),
  ('Kevin', 'Tupik', 3, NULL),
  ('Kumal', 'Singh', 4, 2),
  ('Malia', 'Brown', 5, NULL),
  ('Sarah', 'Lourd', 6, 3),
  ('Tom', 'Allen', 6, NULL);