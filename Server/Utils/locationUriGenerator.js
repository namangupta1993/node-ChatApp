var getLocationUri = (from, locationObject) => {

    var latitute = locationObject.latitude;
    var longitude = locationObject.longitude;

    return {
        from
        , url: `https://www.google.co.in/maps/@${latitute},${longitude},17z`
        ,createdAt:new Date().getTime()
}
}

module.exports = getLocationUri 