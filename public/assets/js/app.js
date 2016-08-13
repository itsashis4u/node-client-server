 var numadicApp = angular.module('numadicApp', []);

 numadicApp.controller('indexController', function ($scope, $timeout) {

     var map = null;
     var socket = null;
     var truckMarkerInitialised = false;
     var truckMarker = null;
     var bounds = "";
     var infoWindowContent = "";
     var infowindow = "";

     initSocketIO();
     initMap();
     $scope.title = "SAMPLE WEB DEMO";

     function initMap() {

         //Sample Coordinates For India     
         var myLatLng = {
             lat: 20.593684,
             lng: 78.96288
         };
         
         map = new google.maps.Map(document.getElementById('map'), {
             zoom: 4,
             center: myLatLng,
             disableDefaultUI: true,
             mapTypeId: google.maps.MapTypeId.ROADMAP,
             styles: [
                 {
                     "elementType": "all",
                     "featureType": "water",
                     "stylers": [{
                             "hue": "#e9ebed"
                         },
                         {
                             "saturation": -78
                         },
                         {
                             "lightness": 67
                         },
                         {
                             "visibility": "simplified"
                         }
                        ]
                    },
                 {
                     "elementType": "all",
                     "featureType": "landscape",
                     "stylers": [{
                             "hue": "#ffffff"
                         },
                         {
                             "saturation": -100
                         },
                         {
                             "lightness": 100
                         },
                         {
                             "visibility": "simplified"
                         }
                      ]
                    },
                 {
                     "elementType": "geometry",
                     "featureType": "road",
                     "stylers": [{
                             "hue": "#bbc0c4"
                         },
                         {
                             "saturation": -93
                         },
                         {
                             "lightness": 31
                         },
                         {
                             "visibility": "on"
                         }
                          ]
                    },
                 {
                     "elementType": "all",
                     "featureType": "poi",
                     "stylers": [{
                             "hue": "#ffffff"
                         },
                         {
                             "saturation": -100
                         },
                         {
                             "lightness": 100
                         },
                         {
                             "visibility": "off"
                         }
                          ]
                    },
                 {
                     "elementType": "geometry",
                     "featureType": "road.local",
                     "stylers": [{
                             "hue": "#e9ebed"
                         },
                         {
                             "saturation": -90
                         },
                         {
                             "lightness": -8
                         },
                         {
                             "visibility": "on"
                         }
                          ]
                    },
                 {
                     "elementType": "all",
                     "featureType": "transit",
                     "stylers": [{
                             "hue": "#e9ebed"
                         },
                         {
                             "saturation": 10
                         },
                         {
                             "lightness": 69
                         },
                         {
                             "visibility": "on"
                         }
                          ]
                    },
                 {
                     "elementType": "all",
                     "featureType": "administrative.locality",
                     "stylers": [{
                             "hue": "#2c2e33"
                         },
                         {
                             "saturation": 7
                         },
                         {
                             "lightness": 19
                         },
                         {
                             "visibility": "on"
                         }
                          ]
                    },
                 {
                     "elementType": "labels",
                     "featureType": "road",
                     "stylers": [{
                             "hue": "#bbc0c4"
                         },
                         {
                             "saturation": -93
                         },
                         {
                             "lightness": 31
                         },
                         {
                             "visibility": "on"
                         }
                          ]
                    },
                 {
                     "elementType": "labels",
                     "featureType": "road.arterial",
                     "stylers": [{
                             "hue": "#bbc0c4"
                         },
                         {
                             "saturation": -93
                         },
                         {
                             "lightness": -2
                         },
                         {
                             "visibility": "on"
                         }
                          ]
                    }
                ]
         });



     }
     
     function initTruckMarker(socketData) {
         map.setZoom(12);
         infowindow = new google.maps.InfoWindow({
             content: "<div><b>Speed : </b> " + socketData.speed + "</div>" + "<div><b>Odometer : </b>" + socketData.odometer + "</div>" + "<div><b>Time : </b> " + formatDate(socketData.time) + "</div>"
         });

         var new_location = {
             lat: parseFloat(socketData.latitude),
             lng: parseFloat(socketData.longitude)
         }
         map.setCenter(new_location);
         truckMarker = new google.maps.Marker({
             position: new_location,
             map: map,
             title: 'Truck!',
             icon: 'assets/img/truck.png'
         });

         truckMarker.addListener('click', function () {
             updateInfoWindowContent();
         });
         truckMarkerInitialised = true;
     }


     function initSocketIO() {
         socket = io();
         socket.on('welcome', function (data) {
        	 console.log('SocketDataOnWelcomeEvent: '+data);
             // Respond with a message including this clients' id sent from the server
             socket.emit('i am client', {
                 data: 'foo!',
                 id: data.id
             });
         });

         socket.on('DataEvent', function (data) {
        	 console.log('SocketDataOnDataEvent: '+JSON.stringify(data));
             $scope.updateTruckMarker(data.msg);
         });
         socket.on('error', console.error.bind(console));
         socket.on('message', console.log.bind(console));
     }

     function updateInfoWindowContent() {
         infowindow.setContent(infoWindowContent);
         infowindow.open(map, truckMarker);
     }

     $scope.updateTruckMarker = function (socketData) {

         if (socketData != null && socketData != undefined) {

             if (!truckMarkerInitialised) {
                 initTruckMarker(socketData)
             } else {
                 var new_location = {
                     lat: parseFloat(socketData.latitude),
                     lng: parseFloat(socketData.longitude)
                 }

                 infoWindowContent = "<div><b>Speed :</b> " + socketData.speed + "</div>" + "<div><b>Odometer :</b> " + socketData.odometer + "</div>" + "<div><b>Time :</b> " + formatDate(socketData.time) + "</div>";
                 truckMarker.setPosition(new_location);
             }
         }
     };

     function formatDate(current_date) {
         var theDate = new Date(current_date * 1000);
         dateString = theDate.toGMTString();
         return dateString
     }
 });