var socket = io();

function sendData() {
    var data = {
        deviceId: getDeviceId(),
        latitude : getCoordinates().lat,
        longitude : getCoordinates().lng,
        time: new Date().hhmmss(),
        date: new Date().yymmdd(),
        status: getHexCode(),
        speed: getSpeed()
    }
    socket.emit('message', data);
}


//Function to get a random Device ID for each session
function getDeviceId() {
    if (sessionStorage.getItem('deviceId') === null) {
        var id = Math.floor(Math.random() * 100);
        sessionStorage.setItem('deviceId', "Device-" + id);
    }
    return sessionStorage.getItem('deviceId');
}

//function to set random initial coordinates
function setInitCoordinates() {
    if (sessionStorage.getItem('coordinates') === null) {
        var lat = (Math.random() * (12.97 - 10) + 10).toFixed(8) * 1;
        var lng = (Math.random() * (77.63 - 70) + 70).toFixed(8) * 1;
        sessionStorage.setItem('coordinates', lat + "," + lng);
    }
    return sessionStorage.getItem('coordinates');
}

//
function getCoordinates(){
	var coords = setInitCoordinates();
	var lat = coords.split(',')[0].toString().substring(0,7);
	var lng = coords.split(',')[1].toString().substring(0,7);
	lat = lat + Math.floor(Math.random() * 10000);
	lng = lng + Math.floor(Math.random() * 10000);
	return {lat : lat, lng : lng};
}
//function to make the time and date values as '01'
function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}

//To add hhmmss format time support
Date.prototype.hhmmss = function() {
    var today = new Date(),
        h = checkTime(today.getHours()),
        m = checkTime(today.getMinutes()),
        s = checkTime(today.getSeconds());
    return (h + "" + m + "" + s);
}

//To add yymmdd format date support
Date.prototype.yymmdd = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [this.getFullYear().toString().slice(-2), checkTime(mm), checkTime(dd)].join('');
};

//Function to generate random status hex code
function getHexCode() {
    return '0x' + Math.floor(Math.random() * 255).toString(16).toUpperCase();
}

//Function to generate random speed
function getSpeed() {
    return Math.floor(Math.random() * (100 - 10)) + 10;
}

window.onload = function() {
    setInterval(sendData, 5000);

}