// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
	// Pre-initialization of variables in order to keep a "global" scope
	var markers = [];
	var cameras;

	var map_options = {
		center: { 
			lat: 47.6, 
			lng: -122.3
		},
		zoom: 12
    };
    var map = new google.maps.Map(document.getElementById('map'), map_options);
    var infowindow = new google.maps.InfoWindow();

	$.getJSON("http://data.seattle.gov/resource/65fc-btcc.json")
		.done(function(in_list) {
			cameras = in_list;
			cameras.forEach(function(camera) {
				var marker = new google.maps.Marker({
					position: {
						lat: parseFloat(camera.location.latitude),
						lng: parseFloat(camera.location.longitude)
					},
					map: map,
				});
				markers.push(marker);

				// Set up click events for the markers.
				google.maps.event.addListener(marker, 'click', function() {
					map.panTo(this.getPosition());
					var html_content = '<p>' + camera.cameralabel + '</p>' + '<img src="' + camera.imageurl.url + '" alt="' + camera.cameralabel + ' camera">';
					infowindow.setContent(html_content);
					infowindow.open(map, this);
				});
				// Close the infowindow if the user clicks on the map itself.
				google.maps.event.addListener(map, 'click', function(){
                    infowindow.close();
                });
			})
		})
		.fail(function(e) {
			alert('e');
		});

	$('#search').bind('search keyup', function() {
		var search_string = $('#search').val().toLowerCase();
		cameras.forEach(function(camera, i) {
			var camera_label = camera.cameralabel.toLowerCase();
			if (camera_label.indexOf(search_string) > -1) { // http://stackoverflow.com/questions/5388429/javascript-jquery-how-to-check-if-a-string-contain-specific-words
				markers[i].setMap(map);  // reveal marker
			}
			else {
				markers[i].setMap(null); // hide marker
			}
		});
	});
});



        