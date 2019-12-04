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
//获取button
var recvideo = document.querySelector('video#recplayer');
var btnRecord = document.querySelector('button#record');
var btnPlay = document.querySelector('button#recplay');
var btnDownload = document.querySelector('button#download');

var  buffer; //定义二进制数组
var mediaRecorder;


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
    window.stream = stream;
    audioplay.srcObject = stream;

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
            //     facingMode:'environment',
            //     deviceId : deviceId ? {exact:deviceId}:undefined
            // },
            // audio:true //使用音频
            audio:{
                noiseSuppression:true,
                echoCancellation:true,
                deviceId : deviceId ? {exact:deviceId}:undefined
            }

        };
         navigator.mediaDevices.getUserMedia(constraints) //抓取桌面的数据改为 getDisplayMedia
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
    picture.className = filterSelect.value; //特效处理
    picture.getContext('2d').drawImage(videoplay,0,0,picture.width,picture.height);
};
//视频录制下载
function handleDataAvailable(e) {
    if (e && e.data && e.data.size > 0){
        buffer.push(e.data);
    }
}
function startRecord(){
        buffer = [];
        var options = {
            mimeType:'video/webm;codecs=vp8'
        };
        if (!MediaRecorder.isTypeSupported(options.mimeType)){
            console.error('${options.mimeType} is not supported');
            return;
        }
        try {
            mediaRecorder = new MediaRecorder(window.stream,options)
        }catch (e) {
            console.error('Failed to create MediaRecord',e);
            return;
        }
        mediaRecorder.ondataavailable=handleDataAvailable;
        mediaRecorder.start(10);
}
function stopRecord(){
    mediaRecorder.stop();
}
btnRecord.onclick = () =>{
    if (btnRecord.textContent === 'Start Record'){
        startRecord();
        btnRecord.textContent = 'Stop Record';
        btnPlay.disable=true;
        btnDownload.disable=true;
    } else {
        stopRecord();
        btnRecord.textContent = 'Start Record';
        btnPlay.disable=false;
        btnDownload.disable=false;
    }
};
btnPlay.onclick = () =>{
    var  blob = new Blob(buffer,{type:'video/webm'});
    recvideo.src = window.URL.createObjectURL(blob);
    recvideo.controls = true;
    recvideo.play();
};
btnDownload.onclick =() =>{
    var blob = new Blob(buffer,{type:'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a')
    a.href = url;
    a.style.display = 'none';
    a.download = 'aaa.webm';
    a.click()
};
