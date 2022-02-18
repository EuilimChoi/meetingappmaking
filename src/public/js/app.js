const socket = io(); // 최초에 소켓아이오를 설치하면 앱과 서버를 연결시키는 함수 io가 생성되고 사용자는 그냥 함수를 사용해서 앱과 서버를 연결할 수 있다.

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")

function handleRoomSubmit(e){
    e.preventDefault();
    const input = form.querySelector("input")
    socket.emit("room",{payload : input.value}
    )
    input.value ="";



form.addEventListener("submit", handleRoomSubmit);