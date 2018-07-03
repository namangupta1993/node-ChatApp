var moment = require('../../public/js/libs/moment');

var generateMessage = (from, text) => {

    return {
        from
        , text
        , createdAt: moment().format('h:mm a')
    }
}

module.exports = generateMessage