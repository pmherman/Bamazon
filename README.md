# CLI Bamazon

<b>Technologies Used</b>: Node.js mySQL, NPM mySQL, NPM Inquirer, NPM cli-table, Visual Studio Code, Sequel Pro, MAMP, SourceTree

Before running program please use NPM install to install required packages for program to execute

---------------------------------------bamazonCustomer.js---------------------------------------

Bamazon Customer view will show the user the items available for purchase from the sql database and prompt the user to decide what they would like to purchase. After the user has made their purchase and selected the amount they are buying, the system will return with an "insufficient Quantity" message and exit to the command prompt. If there is enough of the item to purchase the system will return the total the purchase has cost and then exit to the command prompt. 

Execute program in CLI using: node bamazoncustomer.js

![alt text](https://github.com/pmherman/Bamazon/blob/master/bamazonCustomer.png)

---------------------------------------bamazonManager.js---------------------------------------

Bamazon Manager view allows the manager to:
  - View products for sale.
  - View low inventory levels.
  - Add to current inventory levels.
  - Add new products
  - Exit the system.
The system will continue to loop until the manager exits the program. All updates to the system are made throug hthe primary key item_id. It is recommended to view the products for sale before making any changes to the system. All updates are saved to the database.

Execute program in CLI using: node bamazonManager.js

![alt text](https://github.com/pmherman/Bamazon/blob/master/bamazonManager.png)

---------------------------------------bamazonManager.js---------------------------------------

Bamazon Supervisor view allows the supervisor to:
  - View Product Sales by Department
  - Create New Department
The system is pulling information from two SQL tables (products & departments). The variable inside the JavaScript will calculate the Total Profits and add it to the table for the supervisor to see.

Execute program in CLI using: node bamazonSupervisor.js

![alt text](https://github.com/pmherman/Bamazon/blob/master/bamazonSupervisor.png)


---------------------------------------Database---------------------------------------

Both schema and seed files are included for creating the localhost database

--CSV seed files need to be aligned by column name when importing--
