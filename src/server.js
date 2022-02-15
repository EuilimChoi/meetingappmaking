import express from "express";
import http from "http"
import WebSocket from "ws";

const app = express()
app.set("view engine","pug")
app.set("views",__dirname+"/views")
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (_,res)=> res.render("home"));
app.get("/*", (_,res)=> res. redirect("/"));


const handleListen =() => console.log(`Listening on HTTP://localhost:3000`)
// app.listen(3000, handleListen);

const server = http.createServer(app) // express는 SW를 지원하지 않기 때문에 node의 http로 서버를 열어줘야함
const wss = new WebSocket.Server({server});

const sockets = [];

wss.on("connection",(socket)=>{
        sockets.push(socket);
        socket.send("Hello!");
        console.log("Connected with Browser");
        socket.on("close", ()=>console.log("disconnected from Browser"));
        socket.on("message",(message)=>{sockets.forEach(aSocket => aSocket.send(message.toString()))});
    })

server.listen(3000, handleListen);