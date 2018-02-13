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
    displayInventory();
});
//Displays the invetory for user to select.
function displayInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, inv) {
        console.log("\nWELCOME TO BAMAZON!!!!");
        console.log("Please select from the products below.\n");
        console.log("========================\n");
        var table = new Table({
            head: ["ITEM_ID", "PRODUCT NAME", "DEPARTMENT NAME", "PRICE", "STOCK \nQTY"],
            colWidths: [10, 40, 20, 9, 8]
        });   
        for (var i=0; i < inv.length; i++) {
            var productArray = [inv[i].item_id, inv[i].product_name, inv[i].department_name, inv[i].price, inv[i].stock_quantity];
            table.push(productArray);
        }
        console.log(table.toString());
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
        var query = "SELECT product_name, price, stock_quantity, product_sales FROM products WHERE ?";
        connection.query(query, { item_id: answer.selection }, function(err, res) {
            for (var i=0; i < res.length; i++) {
                console.log("You are purchasing " + answer.qty + " of " + res[i].product_name + ".");
                if (answer.qty <= parseInt(res[i].stock_quantity)) {
                    var total = parseFloat(answer.qty) * parseFloat(res[i].price).toFixed(2);
                    console.log("Purcase Completed! Your total is $" + total.toFixed(2));
                    var newInventoryTotal = parseInt(res[i].stock_quantity) - parseInt(answer.qty);
                    var newSalesTotal = parseFloat(res[i].product_sales) + (parseFloat(answer.qty) * parseFloat(res[i].price));
                    console.log("There are now " + newInventoryTotal + " prods left.");
                    var updateSales = connection.query("UPDATE products SET ? WHERE ?",[
                        {
                            product_sales: newSalesTotal
                        },
                        {
                            item_id: answer.selection
                        }
                    ],);
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
                    itemSelection();
                }
            }
        })
    })
}