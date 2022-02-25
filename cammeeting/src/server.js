import { doesNotReject } from "assert";
import { Socket } from "dgram";
import express from "express";
import http from "http"
import SocketIO from "socket.io"
//import WebSocket from "ws";


const app = express()
app.set("view engine","pug")
app.set("views",__dirname+"/views")
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (_,res)=> res.render("home"));
app.get("/*", (_,res)=> res. redirect("/"));


const handleListen =() => console.log(`Listening on HTTP://localhost:3000`)
// app.listen(3000, handleListen);

const server = http.createServer(app) // express는 SW를 지원하지 않기 때문에 node의 http로 서버를 열어줘야함
//const wss = new WebSocket.Server({server});
const io = SocketIO(server);

function publicRooms(){
    const {sockets:{adapter:{sids,rooms}}} = io
    // const sids = io.sockets.adapter.sids;
    // const rooms = io.socket.adapter.rooms;
    const publicRooms = [];

    rooms.forEach((value,key) => {
        if(!sids.get(key)){
            publicRooms.push(key)
        }
    })

    return publicRooms
}

function countRoom(roomName){
    return io.sockets.adapter.rooms.get(roomName).size ?  io.sockets.adapter.rooms.get(roomName).size : 1;
}

io.sockets.emit("room_change",publicRooms());

io.on("connection",(socket)=>{
    io.sockets.emit("room_change",publicRooms());
    socket.onAny((event) => {
        // 이 함수는 소켓으로 발생하는 모든 이벤트를 감지한다.
        console.log(`Socket Event : ${event}`);
    });

    socket.on("room", (roomName, done) => {

        socket["nickname"] = "Anon"
        socket.join(roomName);
        done(countRoom(roomName));
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        io.sockets.emit("room_change",publicRooms());

        socket.on("disconnecting",()=>{
            socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1))
        })

        socket.on("disconnet",() =>{
            io.sockets.emit("room_change",publicRooms());
        })

        socket.on("message", (message,room,done)=>{
            socket.to(room).emit("message",`${socket["nickname"]} : ${message}`);
            done()
        })

        socket.on("nickname",(nickname)=>{
            console.log(nickname)
            socket["nickname"] = nickname;
        })
    })
})





// const sockets = [];

// wss.on("connection",(socket)=>{
//         sockets.push(socket);
//         socket["nickname"] = "Somebody";
//         socket.send("Hello!");
//         console.log("Connected with Browser");
//         socket.on("close", ()=>console.log("disconnected from Browser"));
//         socket.on("message",(message)=>console.log(JSON.parse(message)));
//         socket.on("message",(message)=>{
//             const parsed = JSON.parse(message)
//             switch (parsed.type) {
//                 case "message": 
//                     sockets.forEach((aSoket)=> aSoket.send(`${socket.nickname} : ${parsed.payload}`));
//                     break;

//                 case "nickname":
//                     socket["nickname"] = parsed.payload;
//                     break;
//             }
//         });
//     })


server.listen(3000, handleListen);