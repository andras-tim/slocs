'use strict';

var map,
    marker;

// jshint -W098
function initMap() { // jshint +W098
    map = new google.maps.Map(document.getElementById('map'), {
        'zoom': 15
    });

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    marker = new google.maps.Marker({
        'map': map
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
            lastSpeed = data.speed_mps === null ? '?' : data.speed_mps * 3.6,
            title =
                'Frissítve: ' + lastEpoch + ' perce\n\n' +
                'Pontosság: ' + data.loc_acc_m + ' m\n' +
                'Magasság: ' + lastAltitude + ' m\n\n' +
                'Sebesség: ' + lastSpeed + ' km/h';

        marker.setTitle(title);

        if (marker.getPosition() === undefined) {
            marker.setAnimation(google.maps.Animation.DROP);
            map.setCenter(lastLocation);
        } else {
            marker.setAnimation(null);
        }

        if (isMovedMarker(lastLocation)) {
            marker.setPosition(lastLocation);
        }

        setTimeout(updateMap, 15000);
    });
}

function isMovedMarker(lastLocation) {
    var currentPosition = marker.getPosition();
    return currentPosition === undefined || currentPosition.equals(new google.maps.LatLng(lastLocation));
}
