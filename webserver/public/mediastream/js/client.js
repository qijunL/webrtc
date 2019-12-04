'use strict'
//devices
var audioSource = document.querySelector("select#audioSource");
var audioOutput = document.querySelector("select#audioOutput");
var videoSource = document.querySelector("select#videoSource");
//filter
var filterSelect = document.querySelector("select#filter");
//picture
var snapshot = document.querySelector("button#snapshot");
var picture = document.querySelector("canvas#picture");
picture.width=640;
picture.height=480;

//音频和视频

// var videoplay = document.querySelector("video#player");
var audioplay = document.querySelector("video#audioplayer");

var divConstraints = document.querySelector("div#constraints");

function getDevices(deviceInfos) {
        deviceInfos.forEach(function (deviceInfo) {
            console.log(deviceInfo.kind+":label="
                                        +deviceInfo.label + ":id="
                                        +deviceInfo.deviceId+":groupId="
                                        +deviceInfo.groupId)
            var option = document.createElement('option');
            option.text = deviceInfo.label;
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audioinput') {
                audioSource.appendChild(option)
            }else if (deviceInfo.kind === 'audiooutput') {
                audioOutput.appendChild(option)
            }else if (deviceInfo.kind === 'videoinput'){
                videoSource.appendChild(option)
            }
        })
}
function gotMediaStream(stream) {
    // videoplay.srcObject = stream;
    audioplay.srcObject = stream

    // var videoTrack = stream.getVideoTracks()[0];
    // var vidoConstraints = videoTrack.getSettings();
    // divConstraints.textContent = JSON.stringify(vidoConstraints,null,2);
    return navigator.mediaDevices.enumerateDevices();


}
function handleError(err) {
    console.log(err.name + ":" + err.message)
}
function start() {
    if(!navigator.mediaDevices ||
    !navigator.mediaDevices.enumerateDevices){
    console.log("enumerateDevice is not supported");
    return;
}else {
        var deviceId = videoSource.value;
        var constraints = {
            // video:{
            //     width:640,
            //     height:480,
            //     frameRate:15,
            //     facingMode:'enviroment',
            //     deviceId : deviceId ? {exact:deviceId}:undefined
            // },
            audio:true
        };
         navigator.mediaDevices.getUserMedia(constraints)
            .then(gotMediaStream)
            .then(getDevices)
            .catch(handleError)
}
}
start();
videoSource.onchange = start;
filterSelect.onchange = function () {
    videoplay.className = filterSelect.value;
};
snapshot.onclick = function () {
    picture.className = filterSelect.value;
    picture.getContext('2d').drawImage(videoplay,0,0,picture.width,picture.height);
};
