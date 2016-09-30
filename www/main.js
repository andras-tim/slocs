'use strict';

var map,
    circle,
    infoWindow;

// jshint -W098
function initMap() { // jshint +W098
    map = new google.maps.Map(document.getElementById('map'), {
        'zoom': 15
    });


    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    infoWindow = new google.maps.InfoWindow({
        'disableAutoPan': false
    });
    google.maps.event.addListener(infoWindow, 'domready', function () {
        var infoWindowCloseButton = $('.gm-style-iw').next('div');
        infoWindowCloseButton.hide();
    });
    google.maps.event.addListener(map, 'drag', function () {
        infoWindow.close();
    });
    google.maps.event.addListener(map, 'dragend', function () {
        infoWindow.open(map);
    });

    circle = new google.maps.Circle({
        'map': map,
        'clickable': false,
        'strokeWeight': 1.5,
        'strokeColor': '#00f',
        'strokeOpacity': 0.8,
        'fillColor': '#00f',
        'fillOpacity': 0.35
    });

    updateMap();
}

function updateMap() {
    $.getJSON('data.json', function (data) {
        var now = new Date(),
            lastDate = new Date(data.date),
            lastEpoch = Math.floor((now - lastDate) / 60000),
            lastLocation = {
                'lat': data.loc[0],
                'lng': data.loc[1]
            },
            lastAltitude = data.alt_m === null ? '?' : data.alt_m,
            lastSpeed = data.speed_mps === null ? '?' : data.speed_mps * 3.6;

        infoWindow.setContent(
            '<strong>Frissítve:</strong> ' + lastEpoch + ' perce<br/><hr/>' +
            '<table>' +
            '  <tbody>' +
            '    <tr><td><strong>Magasság:</strong></td><td align="right">' + lastAltitude + '</td><td>m</td></tr>' +
            '    <tr></td><td><strong>Sebesség:</strong></td><td align="right">' + lastSpeed + '</td><td>km/h</td></tr>' +
            '  </tbody>' +
            '</table>'
        );

        if (circle.getCenter() === undefined) {
            map.setCenter(lastLocation);
            infoWindow.open(map);
        }

        if (isMovedMarker(lastLocation)) {
            circle.setOptions({
                'radius': data.loc_acc_m,
                'center': lastLocation
            });
            infoWindow.setPosition(lastLocation);
        }

        setTimeout(updateMap, 15000);
    });
}

function isMovedMarker(lastLocation) {
    var currentPosition = circle.getCenter();
    return currentPosition === undefined || currentPosition.equals(new google.maps.LatLng(lastLocation));
}
