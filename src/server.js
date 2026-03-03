require("dotenv").config();
const express=require('express'); //importing express module for building the server and handling HTTP requests

const http=require('http'); //importing http module to create a server
const cors=require('cors'); //importing cors module to enable cross-origin resource sharing from different origins
const app=express(); //creating an instance of express
//const {Server}=require("socket.io"); //importing server from socket.io module for handling WebSocket connections
const server=http.createServer(app); //creating a server using http module and passing the express app as an argument for handling HTTP requests
const initlizeSocket=require('./utils/socket'); //importing the initlizeSocket function from the socket.js file for handling WebSocket connections
const connectDB=require('./config/database'); //importing the connectDB function from the database.js file for connecting to the MongoDB database
const createRoomRoute=require('./Routes/createroom'); //importing the createRoomRoute from the createroom.js file for handling the route to create a room
app.use(cors(
    {origin:"http://localhost:5173",
        credentials:true
    })); //enabling CORS for all routes
app.use(express.json()); //enabling JSON parsing for incoming requests
app.use('/',createRoomRoute); //using the createRoomRoute for handling routes related to creating a room
 //connecting to the MongoDB database by calling the connectDB function
const PORT = process.env.PORT || 5000;
initlizeSocket(server); //initializing the socket connection by passing the server as an argument to the initlizeSocket function
connectDB().then(()=>{
    console.log("Database connection established"); 
    server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`); //starting the server and listening on port 5000
});
}).catch((error)=>{
    console.error("Database connection failed:",error);
}
);
