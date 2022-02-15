
const socket = new WebSocket(`ws://${window.location.host}`)

const messagelist = document.querySelector("ul");
const messageform = document.querySelector("form");

socket.addEventListener("open", ()=>{
    console.log("Connected to Browser!")
})

socket.addEventListener("message", (message)=>{
    console.log(`Just got this : ${message.data} from the Server`)
})

socket.addEventListener("close", ()=>{
    console.log(`disconnect from Server`)
})

function handleSubmit(e){
    e.preventDefault();
    const input = messageform.querySelector("input");
    socket.send(input.value.toString());
    input.value="";
}

messageform.addEventListener("submit", handleSubmit)