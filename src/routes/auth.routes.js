const config                            = require('../../config.json')
const { exchange_code, refresh_token }  = require('../lib/oauth2')
const fetch                             = require('node-fetch')
const { Router }                        = require('express')
const { scope, redirect_uri: redirect } = config.oauth2
const router                            = Router()
const { client_id, client_secret }      = config

const params = [
  client_id,
  client_secret,
  redirect,
  scope
]

// /api/auth/token
router.get('/token', async (req, res) => {
  const code = req.query.code
  if (!code) return res.status(400)

  const result = await exchange_code(code, ...params)
  if (!result) return res.status(401)
  
  const [token_type, access_token, refresh_token, user] = result

  res.send({token_type, access_token, refresh_token, user})
})

// api/auth/refresh_token
router.get('/refresh_token', async (req, res) => {
  const refresh_token = req.query.refresh_token
  if (!refresh_token) return res.status(400).send('Token is not provided')

  const result = await refresh_token(refresh_token, ...params)
  if (!result) return res.status(401)

  const [token_type, access_token, refresh_token, user] = result
  res.send({token_type, access_token, refresh_token, user})
})

module.exports = router