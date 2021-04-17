const fetch         = require('node-fetch')
const { Router }    = require('express')
const router        = Router()

// /api/user/@me
router.get('/@me', async (req, res) => {
    const token = req.query.token
    const token_type = req.query.token_type || "Bearer"

    if (!token) return res.status(400).send('Token is not provided')

    const user = await fetch("https://discord.com/api/users/@me", {
        'Authorization': `${token_type} ${token}`
    })

    if (user.message == "401: Unauthorized") return res.status(401)
    res.status(201).send(user)
})

module.exports = router