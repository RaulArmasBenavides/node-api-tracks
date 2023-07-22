const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUI = require("swagger-ui-express");

//Metadata info about our API
const options  ={
    definition: {
        openapi:"3.0.0",
        info :{title:"Spotify API", version:"1.0.0"}
    },
    apis:["app/routes/tracks.js","app/routes/index.js" ,"app/database/mongo.js"]
};

//Docs en JSON format
console.log("doc en json")
const swaggerSpec = swaggerJSDOC(options);
//Function to setup our docs 
const swaggerDocs = (app,port) =>{
    app.use('/api/v1/docs',swaggerUI.serve,swaggerUI.setup(swaggerSpec));
    app.get('/api/v1/docs.json',(req,res)=>{
        res.setHeader('Content-Type','application/json');
        res.send(swaggerSpec);
    });
    console.log(`Version 1 Docs are available at http://localhost:${port}/api/v1/docs`);
};

module.exports = {swaggerDocs};