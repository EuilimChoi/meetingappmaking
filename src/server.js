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

io.on("connection",(socket)=>{
    socket.onAny((event) => {
        // 이 함수는 소켓으로 발생하는 모든 이벤트를 감지한다.
        console.log(`Socket Event : ${event}`);
    });
    socket.on("room", (roomName, done) => {
        socket.join(roomName);
        done();
        console.log(socket.rooms)
        console.log(socket)
        socket.to(roomName).emit("welcome")
        socket.on("disconnecting",()=>{
            socket.rooms.forEach(room => socket.to(room).emit("bye"))
        })
        socket.on("message", (message)=>{
            socket.rooms.forEach(room => socket.to(room).emit("message", message))
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