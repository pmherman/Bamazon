var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log("\nWelcome to Bamazon Manager Portal");
    managerOptions()
});
//Function for management selector
function managerOptions() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Please make a selection.",
        choices: ["View products for sale.",
                  "View low inventory.",
                  "Add to current inventory levels.",
                  "Add new product.",
                  "Exit the system."
                ]
    }).then(function(answer) {
        switch (answer.action) {
            case "View products for sale.":
                displayInventory();
                break;
            case "View low inventory.":
                lowInventory();
                break;
            case "Add to current inventory levels.":
                addInventory();
                break;
            case "Add new product.":
                addNewItem();
                break;
            case "Exit the system.":
                quitManager();
                break;
        }
    });
}
//Displays the invetory for user to select.
function displayInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, inv) {
        console.log("========================\n");        
        console.log("Current available products for sale:\n");
        for (var i=0; i < inv.length; i++) {
            console.log("Item ID: " + inv[i].item_id + " | Name: " + inv[i].product_name + " | Department: " + inv[i].department_name + " | Price: $" + inv[i].price + " | Inventory Levels: " + inv[i].stock_quantity);
        }
        managerOptions();
    })
};
//Displays low inventory levels
function lowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5"
    connection.query(query, function(err, res) {
        console.log("========================\n");  
        console.log("\nItems with low inventory levels less than 5:\n")
        for (var i=0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " | Name: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: $" + res[i].price + " | Inventory Levels: " + res[i].stock_quantity);
        }
        managerOptions();
    })
};
//Add quantity to stock_inventory levels
function addInventory() {
    inquirer.prompt([ 
        {
            name: "selection",
            type: "input",
            message: "Please type the Item ID of the item you would like to increase the quantity of: "
        },
        {
            name: "qty",
            type: "input",
            message: "How many items are we adding to the current inventory?: "
        },
        ])
        .then(function(answer) {
            var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
            connection.query(query, { item_id: answer.selection }, function(err, res) {
                for (var i=0; i < res.length; i++) {
                    var newInventory = parseInt(res[i].stock_quantity) + parseInt(answer.qty);
                    var updateInventoryDB = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newInventory
                            },
                            {
                                item_id: answer.selection
                            }
                        ], 
                    )
                }
            })
            console.log("Inventory Levels Updated Successfully...");
            managerOptions();
        })
}
//Allows user to add a new Item to the system
function addNewItem() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Item Name: "
        },
        {
            name: "department",
            type: "input",
            message: "Department Name: "
        },
        {
            name: "price",
            type: "input",
            message: "Enter Price : $"
        },
        {
            name: "qty",
            type: "input",
            message: "Enter quantity of product available"
        },
    ]).then(function(answer) {
        var query = "INSERT INTO products SET ?"
        connection.query(query,
            {
                product_name: answer.name,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.qty
            }, 
        )
        console.log("Item added to inventory successfully!");        
        managerOptions();
    })
}
//Exits Bamazon Manager View
function quitManager() {
    connection.connect(function(err) {
        console.log("\nLogging off...");
        connection.end();
    });
}