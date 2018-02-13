//BAMAZON SUPERVISOR VIEW

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    //Access to Bamazon Database
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("\nBAMAZON SUPERVISOR VIEW!!!!");
    console.log("Please select from the products below.\n");
    console.log("========================\n");
    supervisorOptions();
});
//Function for supervisor selector
function supervisorOptions() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Please make a selection.",
        choices: ["View product sales by department.",
                  "Create New Department.",
                  "Exit the system."
                ]
    }).then(function(answer) {
        switch (answer.action) {
            case "View product sales by department.":
                displayProductSales();
                break;
            case "Create New Department.":
                newDepartment();
                break;
            case "Exit the system.":
                quitManager();
                break;
        }
    });
}

function displayProductSales() {
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.price, products.stock_quantity, products.product_sales FROM products INNER JOIN departments ON (products.`department_name` = departments.department_name) GROUP BY departments.department_name";
    connection.query(query, function(err, res) {
        console.log("========================\n");        
        console.log("Current Product Sales\n");
        var table = new Table({
            head: ["DEPARTMENT\nID", "DEPARTMENT NAME", "OVER HEAD COSTS", "PRODUCT\nSALES", "TOTAL PROFIT"],
            colWidths: [14, 30, 20, 15, 15]
        }); 
        var totalProfit; 
        for (var i=0; i < res.length; i++) {
            totalProfit = res[i].product_sales - res[i].over_head_costs;
            var productArray = [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, totalProfit.toFixed(2)];
            table.push(productArray);
        }
        console.log(table.toString());
        supervisorOptions();
    })
};
//Allows user to create a new department
function newDepartment() {
    inquirer.prompt([ 
        {
            name: "department",
            type: "input",
            message: "Please enter department name: "
        },
        {
            name: "overhead",
            type: "input",
            message: "What is the starting over head costs for this department?: ",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        ]).then(function(answer) {
            var query = "INSERT INTO departments SET ?"
            connection.query(query,
                {
                    department_name: answer.department,
                    over_head_costs: answer.overhead
                },
            )
            console.log("Department added successfully!!");
            supervisorOptions();
        })
}
//Exits Bamazon Manager View
function quitManager() {
    connection.connect(function(err) {
        console.log("\nLogging off Supervisor Console...");
        connection.end();
    });
}