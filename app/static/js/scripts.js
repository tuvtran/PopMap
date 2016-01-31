
$(document).ready(function(){
    var locations = {
        origin: "",
        destination: ""
    };

    /* google maps -----------------------------------------------------*/
    google.maps.event.addDomListener(window, 'load', initialize);
    function initialize() {
        // initializing some variables here
        // ***********
        var jsonObj;
        var routes = [];
        var legs = [];
        var origin_place_id = null;
        var destination_place_id = null;
        var travel_mode = google.maps.TravelMode.WALKING;
        /* position Philly */
        var latlng = new google.maps.LatLng(39.9522, -75.1641);
        // Map properties
        var mapOptions = {
            center: latlng,
            scrollWheel: false,
            zoom: 15,
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            rotateControl:true
        };
        // Configurations for Marker on the map
        var marker = new google.maps.Marker({
            position: latlng,
            url: '/',
            // So this is the effing animation for the marker
            animation: google.maps.Animation.DROP
        });
        // Create a new map
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;

        var origin_input = document.getElementById('origin-input');
        var destination_input = document.getElementById('destination-input');

        var buttonSearch = document.getElementById('Search');
        // ************
        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        origin_autocomplete.bindTo('bounds', map);
        var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
        destination_autocomplete.bindTo('bounds', map);

        // Display elements on the webpage
        marker.setMap(map);
        directionsDisplay.setMap(map);

        // Event handlers in general
        origin_autocomplete.addListener('place_changed', function() {
            var place = origin_autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            // locations['origin'] = place['formatted_address'];

            // console.log(locations['origin']);
            // expandViewportToFitPlace(map, place);

            // If the place has a geometry, store its place ID and route if we have
            // the other place ID
            origin_place_id = place.place_id;
            locations['origin'] = origin_place_id;

            // route(origin_place_id, destination_place_id, travel_mode,
                //   directionsService, directionsDisplay);
        });

        destination_autocomplete.addListener('place_changed', function() {
            var place = destination_autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            // locations['destination'] = place['formatted_address'];

            // console.log(locations['destination']);
            // expandViewportToFitPlace(map, place);

            // If the place has a geometry, store its place ID and route if we have
            // the other place ID
            destination_place_id = place.place_id;
            locations['destination'] = destination_place_id;

            // route(origin_place_id, destination_place_id, travel_mode,
                //   directionsService, directionsDisplay);
        });

        // If the search button is clicked
        buttonSearch.addEventListener('click', function() {
            marker.setMap(null);

            var origin = locations['origin'];
            var destination = locations['destination'];
            var API_KEY = "AIzaSyC5Hy3vuRKRJ3NXpw_-ynq-hFbgs2nhjGg";
            var url = "https://maps.googleapis.com/maps/api/directions/json?origin=place_id:" + origin
                        + "&destination=place_id:" + destination + "&key=" + API_KEY;
            var url2 = "https://maps.googleapis.com/maps/api/directions/json";
            var params = {
                    origin: origin,
                    destination: destination,
                }

            // alert("Value " + origin);
            // alert("Value " + destination);

            $.getJSON($SCRIPT_ROOT + '_search1', params, function (data) {
                jsonObj = data;
                var waypoints =[];

                service = new google.maps.places.PlacesService(map);
                // service.getDetails(request, callback);

                    for (var i = 0; i < jsonObj['geocoded_waypoints'].length; i++) {
                        console.log(jsonObj['geocoded_waypoints'][i]['place_id']);
                        service.getDetails({
                            placeId: jsonObj['geocoded_waypoints'][i]['place_id']
                        }, function(place, status) {
                            console.log(status);
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                waypoints.push({
                                    location: {
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng()
                                    },
                                    stopover: false
                                });

                                route(origin, destination, travel_mode,
                                      directionsService, directionsDisplay, waypoints);
                            }
                        });

                        if (i == jsonObj['geocoded_waypoints'].length - 1) {
                            console.log("Done");
                        }
                    }
            })
        });

        // Event handler for Google Map
        google.maps.event.addListener(marker, 'click', function() {
            map.setZoom(10);
            map.setCenter(marker.getPosition());
        });

        // Functions
        function expandViewportToFitPlace(map, place) {
            if (place.geometry.viewport) {
                // console.log("success");
                map.fitBounds(place.geometry.viewport);
            } else {
                // console.log("failed");
                map.setCenter(place.geometry.viewport);
                map.setZoom(17);
            }
        }

        function route(origin_place_id, destination_place_id, travel_mode,
                 directionsService, directionsDisplay, waypoints) {
            if (!origin_place_id || !destination_place_id || waypoints.length < jsonObj['geocoded_waypoints'].length) {
                return;
            }

            // for (var i = 0; i < waypoints.length; i++) {
            //     console.log(waypoints[i]);
            // }

            if (waypoints) {
                request = {
                    origin: {'placeId': origin_place_id},
                    destination: {'placeId': destination_place_id},
                    waypoints: waypoints,
                    optimizeWaypoints: true,
                    travelMode: travel_mode
                }
            } else {
                request = {
                    origin: {'placeId': origin_place_id},
                    destination: {'placeId': destination_place_id},
                    travelMode: travel_mode
                }
            }

            directionsService.route(request, function(response, status) {
                    console.log(waypoints);
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
            });
        }
    }
    /* end google maps -----------------------------------------------------*/

    // $("button").click(function() {
    //
    // });
});
