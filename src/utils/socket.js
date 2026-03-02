const socket=require("socket.io"); //importing socket.io module for real-time communication between the server and clients
const User=require("../models/User"); //importing the User model for interacting with the database to store user information and room details
const initlizeSocket=(server)=>{ 
    const io=socket(server,{cors:{origin:"http://localhost:5173"
}});  //creating an instance of socket.io and passing the server as an argument for handling WebSocket connections and cors origin
    let rooms={}; //creating an empty object to store the rooms and their associated clients
    let roomsLocation={}; //creating an empty object to store the rooms and their associated clients location
    io.on("connection",(socket)=>{ //listening for a connection event when a client connects to the server and passing the socket object as an argument for handling the connection
       socket.on("join-room", async ({ roomID, name,userid}) => {

    socket.join(roomID);

    const user = await User.findOne({ roomID });
    const adminID = user ? user.adminUserID : null;
    console.log("adminID:", user ? user.adminUserID : "No user");
 
    if(user && adminID){
           io.to(roomID).emit("adminId", adminID);
    }
    if (user && user.destination) {

        console.log("Sending destination:", user.destination);

        io.to(roomID).emit("set-destination", user.destination);
    

    }


    
    


});
       socket.on('location-update',async({latitude,longitude,roomID,name,userID})=>
    {
        socket.join(roomID); // Joining the specified room using the socket.join() method, allowing the server to send messages to all clients in that room
        const user= await User.findOne({roomID}); // Querying the database to find a user associated with the specified roomID using the User model's findOne() method
        const adminID=user?user.adminUserID:null; 
       roomsLocation[roomID] = roomsLocation[roomID] || {};

       roomsLocation[roomID][userID] = {
        socketID:socket.id,
  username: name,
  adminID: adminID==userID ? adminID :null,
  latitude,
  longitude
};



        console.log("roomsLocation:", roomsLocation); // Logging the current state of the roomsLocation object to the console for debugging purposes
        io.to(roomID).emit("receive-locations", roomsLocation[roomID]);
    });
    
    socket.on("disconnect", () => {

    for (const roomID in roomsLocation) {
        for (const userID in roomsLocation[roomID]) {
            if (roomsLocation[roomID][userID].socketID === socket.id) {
                delete roomsLocation[roomID][userID];
                if (Object.keys(roomsLocation[roomID]).length === 0) {
                    delete roomsLocation[roomID];
                }
                break;
            }
        }
    }

    console.log("User disconnected");

});
    });
    //io.emit("message","hello from server"); //emitting a message to all connected clients with the event name "message" and the data "hello from server"
   console.log("socket initialized"); //logging a message when the socket connection is initialized
};
module.exports=initlizeSocket; //exporting the initlizeSocket function for use in other files

// This code sets up a WebSocket server using the socket.io library. 
// It listens for incoming connections from clients and handles events such as joining a room and disconnecting.
//  When a client connects, it logs a message indicating that a user has connected to a specific room.
//  When a client disconnects, it logs a message indicating that a user has disconnected. 
// The initlizeSocket function is exported for use in other files, allowing the server to handle WebSocket connections when initialized.