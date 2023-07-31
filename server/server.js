const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

//Connection to database server running on localhost
const connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '11111',
    database : 'walksafe_db'
  });


const app = express()

app.use(bodyParser.json({type: 'application/json'}))
app.use(bodyParser.urlencoded({extended:true}))

//Route for signup
app.post('/signup', function(req,res){
  // Connecting to the database.
  connection.getConnection(function (err, connection) {
    //Params taken from text inputs of signup form
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    // Check if all fields of the form are filled in
    if (!username || !email || !password){
      return res.json({message: 'Αll fields are required!', status:400});
    }
    // Executing the MySQL query - Get user's info related to given email address
    connection.query("SELECT * FROM users where email='"+ email + "'", function (error, results) {
      if (error) throw error;
      // if the query returns results , then email already exists in database (user already signed up using that address).
      if(results.length!=0){
        return res.json({message: 'Email already exists.', status:409});
      }
      // Signing up
      else if (username && email && password){
        // Insert user's info into database 
        connection.query("INSERT INTO USERS (username, email, password) VALUES ('"+username+"', '"+email+"', '"+password+"');", function (error, results) {
          if (error) throw error;
          // After signing up, get user's info and send response to client
          connection.query("SELECT * FROM users where email='"+ email + "'", function (error, results) {
            return res.json({message: 'User created.', status:200, "user_id":results[0].user_id.toString(), "user_name":results[0].username.toString(), "user_email":results[0].email.toString(), "user_password":results[0].password.toString()});
          })
          
        })
      }
    })
  })
})

//Route for login
app.post('/login', function(req,res){
  // Connecting to the database.
  connection.getConnection(function (err, connection) {
    //Params taken from text inputs of signup form
    var email = req.body.email;
    var password = req.body.password;
    // Check if all fields of the form are filled in
    if (!email || !password){
      return res.json({message: 'Αll fields are required!', status:400});
    }
    // Executing the MySQL query - Get user's info related to given email address
    connection.query("SELECT * FROM users where email='"+ email + "'", function (error, results) {
      if (error) throw error;
      // if the query doesn't return results, then user hasn't signed up using that address
      if(results.length==0){
        return res.json({message: 'User not found.', status:404});
      }
      else {
        // Check if given password is the same as the one stored in database
        if(password == results[0].password){
          // If password is valid (user is authenticated) , send response to client
          return res.json({message: 'User authenticated.', status:200, "user_id":results[0].user_id.toString(), "user_name":results[0].username.toString(), "user_email":results[0].email.toString(), "user_password":results[0].password.toString()})
        }
        else{
          return res.json({message: 'Invalid password.', status:401})
        }
      }
    })
  })
})



//Route for the users table
app.get('/users', function (req, res) {
    // Connecting to the database.
    connection.getConnection(function (err, connection) {

    // Executing the MySQL query
    connection.query('SELECT * FROM users', function (error, results) {
      // If some error occurs, we throw an error.
      if (error) throw error;

      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
});


//Route for the reports table
app.get('/reports', function (req, res) {
  // Connecting to the database.
  connection.getConnection(function (err, connection) {

  // Executing the MySQL query
  connection.query('SELECT * FROM reports', function (error, results) {
    // If some error occurs, we throw an error.
    if (error) throw error;

    // Getting the 'response' from the database and sending it to our route. This is were the data is.
    res.send(results)
  });
});
});


//Server starts running on localhost, port 3000
app.listen(3000, () => {
    console.log('Go to http://localhost:3000/users so you can see the data.');
   });