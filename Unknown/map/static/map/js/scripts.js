
$(document).ready(function(){/* google maps -----------------------------------------------------*/
var map, latlng, marker, mapOptions;

google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
  /* position Philly */
  latlng = new google.maps.LatLng(39.9522, -75.1641);

  mapOptions = {
    center: latlng,
    scrollWheel: false,
    zoom: 15,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    rotateControl:true
  };

  marker = new google.maps.Marker({
    position: latlng,
    url: '/',
    // So this is the effing animation for the marker
    animation: google.maps.Animation.DROP
  });

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  marker.setMap(map);

  // Event handler for Google Map
  google.maps.event.addListener(marker, 'click', function() {
      map.setZoom(10);
      map.setCenter(marker.getPosition());
  });
};
/* end google maps -----------------------------------------------------*/
});
