//calcDistance: calculates distance between two points
exports.calcDistance = function (lat1, lon1, lat2, lon2) {
    var latDistance = Math.abs(lat1 - lat2);
    var lonDistance = Math.abs(lon1 - lon2);
    return Math.sqrt(latDistance + lonDistance);
}

//outOfBounds: is the user out of original boundaries specified
exports.outOfBounds = function (origLat, origLon, newLat, newLon, radius) {
    var distance = calcDistance(origLat, origLon, newLat, newLon);
    if (distance > radius) {
        return true;
    }
    return false;
}

//calcVelocity: calculate the users velocity
exports.calcVelocity = function (time1, time2, distance) {
    return distance / (Math.abs(time1 - time2));
}

