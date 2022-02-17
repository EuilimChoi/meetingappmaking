
const socket = new WebSocket(`ws://${window.location.host}`)

const messagelist = document.querySelector("ul");
const nicknameform = document.querySelector("#nickname");
const messageform = document.querySelector("#message");


socket.addEventListener("open", ()=>{
    console.log("Connected to Browser!")
})

socket.addEventListener("message", (message)=>{
    
    const li = document.createElement("li");
    li.innerText = message.data;
    messagelist.append(li);
})



socket.addEventListener("close", ()=>{
    console.log(`disconnect from Server`)
})

function handleSubmit(e){
    e.preventDefault();
    const input = messageform.querySelector("input");
    const nickname = nicknameform.querySelector("input");
    socket.send(JSON.stringify({nickname : nickname.value, msg : input.value}));
    console.log({'nickname' : nickname.value, 'msg' : input.value});
    input.value="";
}

function handlenickSubmit(e){
    e.preventDefault();
    const input = nicknameform.querySelector("input");
    socket.send(input.value.toString());
    input.value="";
}

messageform.addEventListener("submit", handleSubmit)
nicknameform.addEventListener("submit", handlenickSubmit)