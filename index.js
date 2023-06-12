const express = require("express");
const hotelRouter = require("./routes/hotel.route");
const ownerRouter = require("./routes/owner.route");
const connection = require("./db");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());





const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Notes API",
            version: "1.0.0",
            description: 
                'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
        }
        
    },
    apis: ["./routes/*.js"]
};


const swaggerSpec = swaggerJsdoc(options);  
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/owners", ownerRouter);
app.use("/hotels", hotelRouter);

app.listen(4500, async () => {
    try {
        await connection;
        console.log("Connected and Server is running at port 4500");
    } catch (error) {
        console.log(error.message);
    }
});