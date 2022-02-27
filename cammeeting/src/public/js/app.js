const socket = io(); // 최초에 소켓아이오를 설치하면 앱과 서버를 연결시키는 함수 io가 생성되고 사용자는 그냥 함수를 사용해서 앱과 서버를 연결할 수 있다.

const myFace = document.getElementById("myFace")
const muteBtn = document.getElementById("Mute")
const cameraBtn = document.getElementById("Camera")
const camerasSelect = document.getElementById("Cameras")


let myStream;
let muted = false;
let cameraOff = false;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter((device)=> device.kind === "videoinput")
        const currentcamera = myStream.getVideoTracks()[0];
        cameras.forEach((camera)=>{
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentcamera.lable === camera.label){
                option.selected = ture;
            }
            camerasSelect.appendChild(option)
        })
    }
    catch(e){
        console.log(e);
    }
    
}


async function getMedia(id){
    const initialConstrains={
        audio: true,
        video: true,
    };

    const newContstrains = {
        audio : true,
        video : { deviceId : {exact : id}},
    }

    try{
        myStream =await navigator.mediaDevices.getUserMedia(
            id ? newContstrains : initialConstrains
        );
            myFace.srcObject = myStream;
            if(!id){
                await getCameras();
            } //셀렉을 할때마다 페이지가 갱신되고 갱신될때마다 리스트를 붙쳐넣기 때문에 이프문으로 한번만 실행되게 막아줌.
    }catch (e){
        console.log(e)
    }
}

getMedia();

function handleMuteClick() {
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    

    if(!muted){
        muteBtn.innerText = "UnMute"
        muted = true;
    }else {
        muteBtn.innerText = "Mute"
        muted = false;
    }
}

function handleCameraClick() {
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    if(cameraOff){
        cameraBtn.innerText = "Camera Off"
        cameraOff = false
    }else {
        cameraBtn.innerText = "Camera ON"
        cameraOff = true
    }
}

async function handleCamerachange(){
    getCameras(camerasSelect.value)
}

muteBtn.addEventListener("click", handleMuteClick)
cameraBtn.addEventListener("click", handleCameraClick)
camerasSelect.addEventListener("input", handleCamerachange)