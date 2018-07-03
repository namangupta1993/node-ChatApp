function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('div:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

var socket = io();

socket.on('connect', function () {

    var param = jQuery.deparam(window.location.search);

    socket.emit('join', param, {
        name: param.name
        , room: param.room
    });

});




socket.on('updateUserList', function (usersList) {

    jQuery('#users').empty();

    var ol = jQuery('<ul></ul>');

    usersList.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});


socket.on('newMessage', function (message) {
    var template = jQuery('#message-template_left').html();
    var html = Mustache.render(template, message);
    jQuery('#messages').append(html);
    scrollToBottom();

});



socket.on('newMessageAdmin', function (message) {
    var template = jQuery('#message-template_admin').html();
    var html = Mustache.render(template, message);
    jQuery('#messages').append(html);
    scrollToBottom();

});

socket.on('newMessage2', function (message) {
    var template = jQuery('#message-template_right').html();
    var html = Mustache.render(template, message);
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage-left', function (message) {
    var template = jQuery('#location-message-template-left').html();
    var html = Mustache.render(template, message);
    jQuery('#messages').append(html);
});

socket.on('newLocationMessage-right', function (message) {
    var template = jQuery('#location-message-template-right').html();
    var html = Mustache.render(template, message);
    jQuery('#messages').append(html);
    scrollToBottom();

});


socket.on('disconnect', function () {
    console.log('disconnected from server');
});


jQuery('#message-form').on('submit', function (e) {

    e.preventDefault();

    var param = jQuery.deparam(window.location.search);
    if (param) {

        var messageBox = jQuery('[name=message]');
        if (messageBox.val()) {
            socket.emit('createMessage', {
                text: messageBox.val()
                , from: param.name
            }, param, function () {

                messageBox.val('');

            });
        }
    }
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, );
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.');
    });
});


socket.on('error_duplicateUser', (param) => {

    alert(`${param.name} is already logged in for room ${param.room}`);
    window.location.replace('../index.html');

});




