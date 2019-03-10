//Running this application will first display all of the items 
//available for sale. Include the ids, names, and prices of products 
//for sale.

var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Karolina14",
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query('SELECT item_id,product_name,item_price FROM products', function (err, res) {
        console.log(res);
        request();
    });
    //connection.end();
});

function request() {

    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'input',
                name: 'item_id',
                message: 'What is the Id of the product you wish to buy?',
            },
            {
                type: 'numeric',
                name: 'quantity',
                message: 'How many items you will like to buy?',
            }
        ])
        .then(function (inquirerResponse) {

            connection.query("SELECT * FROM products WHERE item_id = ?", [inquirerResponse.item_id], function (err, result) {
                if (err) throw err
                //console.log(result[0]);
                if (result[0].stock_quantity < inquirerResponse.quantity) {
                    console.log("Insufficient quantity!");
                    abortProgram();
                } else {
                    result[0].stock_quantity -= inquirerResponse.quantity;
                    console.log(result[0].stock_quantity);
                    console.log("Total to pay is: $ " + (inquirerResponse.quantity * result[0].item_price));
                    console.log("Thanks for your bussiness!!");
                    console.log(result[0].stock_quantity);
                    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [result[0].stock_quantity , inquirerResponse.item_id], function (err, result) {
                        //if (err) throw err
                        console.log("Database Updated ");
                    });

                    abortProgram();
                }

            });
        });
}

function abortProgram() {
    connection.end();
}