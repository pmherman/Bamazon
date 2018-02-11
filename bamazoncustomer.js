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
    displayInventory();
});
//Displays the invetory for user to select.
function displayInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, inv) {
        console.log("\nWELCOME TO BAMAZON!!!!");
        console.log("Please select from the products below.\n");
        console.log("========================\n");
        for (var i=0; i < inv.length; i++) {
            console.log("Item ID: " + inv[i].item_id + " | Name: " + inv[i].product_name + " | Department: " + inv[i].department_name + " | Price: $" + inv[i].price + " | Inventory Levels: " + inv[i].stock_quantity);
        }
        itemSelection();
    })
};

function itemSelection() {
    inquirer.prompt([ 
    {
        name: "selection",
        type: "input",
        message: "Please type the Item ID of the item you would like to purchase: "
    },
    {
        name: "qty",
        type: "input",
        message: "How many would you like to purchase?: "
    },
    ])
    .then(function(answer) {
        var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
        connection.query(query, { item_id: answer.selection }, function(err, res) {
            for (var i=0; i < res.length; i++) {
                console.log("You are purchasing " + answer.qty + " of " + res[i].product_name + ".");
                if (answer.qty <= parseInt(res[i].stock_quantity)) {
                    var total = parseFloat(answer.qty) * parseFloat(res[i].price).toFixed(2);
                    console.log("Purcase Completed! Your total is $" + total.toFixed(2));
                    var newInventoryTotal = parseInt(res[i].stock_quantity) - parseInt(answer.qty);
                    console.log("There are now " + newInventoryTotal + " prods left.");
                    var updateInventory = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                        {
                            stock_quantity: newInventoryTotal
                        },
                        {
                            item_id: answer.selection
                        }
                    ], function(err, res) {
                        console.log("Inventory Levels Updated!");
                        connection.end();
                    }
                )
                } else {
                    console.log("Insufficient Quantity of " + res[i].product_name);
                    connection.end();
                }
            }
        })
    })
}