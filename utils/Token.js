const jwt = require('jsonwebtoken')

exports.createRefreshToken = (id) => {
    return (jwt.sign({
        "user": id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    }))
}

exports.createAccessToken = (id) => {
    return (jwt.sign({
        "userInfo": {
            id
        },
    }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
    ))
}