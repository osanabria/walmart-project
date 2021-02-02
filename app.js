var express = require("express");
var fetch = require('node-fetch');
var methodOverride = require("method-override");
var app = express();
var bodyParser = require("body-parser");
const axios = require('axios');
var btoa = require('btoa');


// APP CONFIG
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));


app.get("/", function(req, res) // main route
{
    if(res.err)
    {
        console.log("Error with /index");
    }
    else
    {
        getPages("all").then((data) => {
            res.render("index", {result : data});
            });
    }
});
app.get("/all", function(req, res) // gets all the issues
{
    if(res.err)
    {
        console.log("Error with /all");
    }
    else
    {
        getPages("all").then((data) => {
            res.render("index", {result : data});
            });
    }
});
app.get("/open", function(req, res) // gets all the open issues
{
    if(res.err)
    {
        console.log("Error with /open");
    }
    else
    {
        getPages("open").then((data) => {
            res.render("index", {result : data});
            });
    }
});
app.get("/closed", function(req, res) // gets all the closed issues 
{
    if(res.err)
    {
        console.log("Error with /closed");
    }
    else
    {
        getPages("closed").then((data) => {
            res.render("index", {result : data});
            });
    }
});


// issue routes
var url; //global variable for the issue url
app.get("/issue", function(req, res) //displays the issue
{
    if(res.err)
    {
        console.log("Error with /issue");
    }
    else
    {
        getIssue(url).then((issue) => {
            getComment(url).then((comment) => {
                if(Object.entries(comment).length != 0)
                {
                    res.render("issue", {issue: issue, comment: Object.entries(comment)});
                }
                else
                {
                    res.render("issue", {issue: issue});
                }
            });
        });
    }
});

app.post("/issue", function(req, res) // recieves url for issue
{
    url = req.body.url;  
    if(res.err)
    {
        console.log("Error with /issue");
    }
    else
    {
        res.redirect("/issue"); 
    }
});


async function getPages(state) {    //makes 5 api calls and creates one big array with all the information
    var data = new Array();
    data1 = Object.entries(await getData(1, state));
    data2 = Object.entries(await getData(2, state));
    data3 = Object.entries(await getData(3, state));
    data4 = Object.entries(await getData(4, state));
    data5 = Object.entries(await getData(5, state));
    data = data1.concat(data2, data3, data4, data5);
    return data;
}

async function getComment(url) { // api call for getting comments
    try {
        return axios.get(url + "/comments")
            .then((res) => {
            return res.data;
            })
            .catch((error) => {
            console.error(error);
            })
        }
        catch (err) {
        console.error(err);
    }
}

async function getIssue(url) { // api call for getting a single issue 
    try {
        return axios.get(url)
            .then((res) => {
            return res.data;
            })
            .catch((error) => {
            console.error(error);
            })
        }
        catch (err) {
        console.error(err);
    }
}
async function getData(page, state) { // api call for getting the repos issues
    try {
        return axios.get('https://api.github.com/repos/walmartlabs/thorax/issues', {
        params:{
                sort : "created",
                per_page: 100,
                state: "all",
                page: page,
                state: state
            }
        })
            .then((res) => {
            return res.data;
            })
            .catch((error) => {
            console.error(error);
            })
        }
        catch (err) {
        console.error(err);
    }
}


app.listen(process.env.PORT || 8080, function(){
    console.log("The Server Has Started!");
});
