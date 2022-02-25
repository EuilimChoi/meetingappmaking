const socket = io(); // 최초에 소켓아이오를 설치하면 앱과 서버를 연결시키는 함수 io가 생성되고 사용자는 그냥 함수를 사용해서 앱과 서버를 연결할 수 있다.

const myFace = document.getElementById("myFace")
const muteBtn = document.getElementById("Mute")
const cameraBtn = document.getElementById("Camera")


let myStream;
let muted = false;
let cameraOff = false;

async function getMedia(){
    try{
        myStream =await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,        });
            myFace.srcObject = myStream;
    }catch (e){
        console.log(e)
    }
}

getMedia();

function handleMuteClick() {
    if(!muted){
        muteBtn.innerText = "UnMute"
        muted = true;
    }else {
        muteBtn.innerText = "Mute"
        muted = false;
    }
}

function handleCameraClick() {
    if(cameraOff){
        cameraBtn.innerText = "Camera Off"
        cameraOff = false
    }else {
        cameraBtn.innerText = "Camera ON"
        cameraOff = true
    }
}



muteBtn.addEventListener("click", handleMuteClick)
cameraBtn.addEventListener("click", handleCameraClick)