var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/deviceStore');

//Database Schema
var Schema = mongoose.Schema;
var deviceSchema = new Schema({
    deviceId: String,
    latitude: String,
    longitude: String,
   	time : String,
    status: String,
    speed: Number
},{
	versionKey : false
});
var DeviceData = mongoose.model('deviceData', deviceSchema);

module.exports = DeviceData;