import { Server } from "socket.io";
import cors from 'cors';

let connections = {}; // To know how many are connected with this socket server
let messages = {};
let timeOnLine = {};

export const connectToSocket = (server) => {
    const io = new Server(server, { // To solve the cross origin error (For production this is no need to add)
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
            
        }
    });

    // Listens for new client connections.
    io.on("connection", (socket) => {  // socket: Represents the individual connection between the client and server.

        socket.on("join-call", (path) => { // Listens for a client event named "join-call", triggered when a user joins a specific room (path). Path means room name,

            if(connections[path] === undefined){ // If the incomming path which is comming from the client side is not present in the connections object then create a empty array for that path to store connected socket IDs.
                connections[path] = [];
            }
            connections[path].push(socket.id); // If not then Push the socket id to the path array because there is more than one user connected with the same path.

            timeOnLine[socket.id] = new Date(); // To know when the user is connected with the server(Means when the user is online).

            for(let a = 0; a < connections[path].length; a++){
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]); // Emit the user-joined event to all the users who are connected with the same path if a new user is joind to the same room.
            }

            if(messages[path] !== undefined){
                for(let a = 0; a < connections[path].length; ++a){
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], 
                        messages[path][a]['socket-id-sender']) // We consider 'socket-id-sender' because of to detect from where the message is comming.
                }
            }


        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) =>{

            const[matchingRoom, found] = Object.entries(connections).reduce(([room, isFound], [roomKey, roomValue]) => {

                if(!isFound && roomValue.includes(socket.id)){
                    return[roomKey, true];
                }

                return[room, isFound];


            }, ['', false]);

            if(found === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = []
                }


                //Add the new message to the room's message history.
                messages[matchingRoom].push({'sender': sender, 'data': data, 'socket-id-sender': socket.id}) // Here the socket id sender and the obove inside "join-call" the 'socket-id-seender' is same. This is important.
                console.log("Message", key, ":", sender, data);


                // Broadcast the message to all users in the room. Include the socket id sender for identification
                connections[matchingRoom].forEach((element) => {
                    io.to(element).emit("chat-message", data, sender, socket.id);
                })
            }

        });

        socket.on("disconnect", () => {

            // Calculate how long the user was online.
            let diffTime = Math.abs(timeOnLine[socket.id] - new Date());

            let key;

            for(const[k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))){ // Iterate through all rooms to find where the disconnected user was. k means key, v means value
                for(let a = 0; a < v.length; a++){
                    if(v[a] === socket.id){
                        key = k;

                        // Notify all remaining users in the room that someone has left.
                        for(let a = 0; a < connections[key].length; a++){
                            io.to(connections[key][a]).emit('user-left', socket.id);
                        };

                        // Remove the disconnected user's socket.id from the room's connection list.
                        let index = connections[key].indexOf(socket.id);
                        connections[key].splice(index, 1);

                        // If no users remain in the room, delete the room entry.
                        if(connections[key].length === 0){
                            delete connections[key]
                        }
                    }
                }
            }
        });
    });

    return io;
}

