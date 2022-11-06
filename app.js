const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { urlencoded } = require("body-parser");
const https = require("https");
const { post } = require("request");

const app = express();
const apiKey = process.env.REACT_APP_API_KEY
const listId = "d9ed8c2cb8";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({extended:true}));

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.")
});

app.get("/", function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
   
    var jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/" + listId;

    const options = {
        method: "POST",
        auth: "mp:" + apiKey
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            if (response.statusCode == 200){
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
        })
    });

    request.write(jsonData);
    request.end();
   
});

