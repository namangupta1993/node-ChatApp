var moment = require('moment-timezone');




var generateMessage = (from, text) => {

    return {
        from
        , text
        , createdAt: moment().utcOffset("+05:30").format('h:mm a')
    }
}




module.exports = generateMessage