DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR (100) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER(10) NOT NULL,
product_sales DECIMAL(10,2) NOT NULL,
PRIMARY KEY (item_id)
);

CREATE TABLE departments (
department_id INTEGER(10) NOT NULL AUTO_INCREMENT,
department_name VARCHAR(100) NOT NULL,
over_head_costs DECIMAL(10,2) NOT NULL,
PRIMARY KEY (department_id)
)