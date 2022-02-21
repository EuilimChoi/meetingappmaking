const socket = io(); // 최초에 소켓아이오를 설치하면 앱과 서버를 연결시키는 함수 io가 생성되고 사용자는 그냥 함수를 사용해서 앱과 서버를 연결할 수 있다.

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")
const room = document.getElementById("room")
const message = room.querySelector("form")

room.hidden = true;

let roomName
let sendmessage
let nickname
let newCount

function showRoom(newCount){
    welcome.hidden = true;
    room.hidden = false;
    const title = room.querySelector("h1")
    title.innerText = `방제목: ${roomName} / 참여인원: ${newCount}`
    const msgform = room.querySelector("#msg");
    const nameform = room.querySelector("#name");
    msgform.addEventListener("submit",handleMessage);
    nameform.addEventListener("submit",handleNicknameSubmit)
}

function handleNicknameSubmit(e){
    e.preventDefault();
    const input = room.querySelector("#name input")
    nickname = input.value
    socket.emit("nickname",nickname)

}

function handleRoomSubmit(e){
    e.preventDefault();
    const input = welcome.querySelector("input")
    roomName = input.value
    socket.emit("room",roomName, showRoom) 
    /* 개쩌는게 처음 인자를 빼고 뒤에 오는 모든 인자 (객체든 함수던) 백엔드로 보낼수 있음,
    함수를 보내는 경우 실제 실행되는 곳은 프론트엔드다. 백엔드에서 해당함수를 실행시킬때 인자를 넣어주면
    프론트에서 해당 인자를 가지고 함수가 실행되어 결과가 출력된다. 
    
    예를 들어 모든 행동이 끝나고 호출되는 함수는 항상 가장 마지막 인자로 집어 넣는다.
    */

    input.value ="";}

function handleMessage(e){
    e.preventDefault();
    const input = room.querySelector("#msg input")
    sendmessage = input.value
    socket.emit("message",sendmessage, roomName, ()=>{
        addmessage(`You : ${sendmessage}`)})
    input.value ="";
}

function addmessage(message) {
    const ul = document.querySelector("#room ul");
    const li = document.createElement("li");
    li.innerText=message;
    ul.appendChild(li);
}


form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome",(nickname, newCount)=>{
    const title = room.querySelector("h1")
    newCount = newCount;
    title.innerText = `방제목: ${roomName} / 참여인원: ${newCount}`
    addmessage(`${nickname} joind!`)
})

socket.on("bye",(nickname, newCount)=>{
    const title = room.querySelector("h1")
    newCount = newCount;
    title.innerText = `방제목: ${roomName} / 참여인원: ${newCount}`
    addmessage(`${nickname}  left`)})

socket.on("message", addmessage)

socket.on("room_change", (rooms)=> {
    const roomlist = welcome.querySelector("ul");
    roomlist.innerText = "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText=room;
        roomlist.append(li);
    });
});