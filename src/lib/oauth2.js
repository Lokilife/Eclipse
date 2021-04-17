const { encodeDataToUrlForm } = require('./tools')
const fetch = require('node-fetch')

module.exports = {
    /**
     * Получает токен юзера и токен сброса из кода;
     * @param {string} code Код
     * @returns {Promise<Array<string>|boolean>}
     */
    exchange_code: async function(code, client_id, client_secret, redirect, scope = 'identify guilds') {
      const params = {
        'client_id'       :client_id,
        'client_secret'   :client_secret,
        'grant_type'      :'authorization_code',
        'code'            :code,
        'redirect_uri'    :redirect,
        'scope'           :scope,
      }
      const response = await fetch(`https://discord.com/api/v8/oauth2/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: encodeDataToUrlForm(params),
        })
      const json = await response.json()
      if (json.message == "401: Unauthorized") return false
      
      const user = await fetch("https://discord.com/api/v8/users/@me", {
        method: "GET",
        headers: {
          "Authorization": `${json.token_type} ${json.access_token}`
        }
      })
      
      const user = this.identify_user(json.token_type, json.access_token)

      return [json.token_type, json.access_token, json.refresh_token, user]
    },
    /**
     * Сбрасывает токен юзера и токен сброса;
     * @param {string} refresh_token Токен
     * @returns {Promise<Array<string>|boolean>}
     */
    refresh_token: async function(refresh_token, client_id, client_secret, redirect, scope = 'identify guilds') {
      const params = {
        'client_id'       :client_id,
        'client_secret'   :client_secret,
        'grant_type'      :'refresh_token',
        'refresh_token'   :refresh_token,
        'redirect_uri'    :redirect,
        'scope'           :scope,
      }
      const response = await fetch(`https://discord.com/api/v8/oauth2/token`,
        {  
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: encodeDataToUrlForm(params),
        })
      const json = await response.json()
      if (json.message == "401: Unauthorized") return false

      const user = this.identify_user(json.token_type, json.access_token)

      return [json.token_type, json.access_token, json.refresh_token, user]
    },
    identify_user: async function(token_type, token) {
      const user = await fetch("https://discord.com/api/v8/users/@me", {
        method: "GET",
        headers: {
          "Authorization": `${token_type} ${token}`
        }
      })
      return await user.json()
    }
}