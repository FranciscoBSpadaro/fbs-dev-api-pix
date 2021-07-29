const axios = require('axios')
const fs = require('fs')
const path = require('path')
const https = require('https')

// carrega o certificado de forma Sincrona
const cert = fs.readFileSync(
  path.resolve(__dirname, `../../certs/${process.env.GN_CERT}`)
)
// adiciona certificado na request https
const agent = new https.Agent({
  pfx: cert,
  passphrase: ''
})
// converte o buffer do clientID e clientSecret para base64 para poder gerar o request  do token
const authenticate = ({ clientID, clientSecret }) => {
  let credentials = Buffer.from(
    `${clientID}:${clientSecret}`
  ).toString('base64')

  // enviando a request post com todos os dados  para receber o token de acesso
  return axios({
    method: 'POST',
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json'
    },
    // corpo do request em json do tipo client credentials do oauth2
    httpsAgent: agent,
    data: {
      grant_type: 'client_credentials'
    }
  })
}

// variavel que armazena o token de acesso para ser exportado para  as rotas de request
const GNRequest = async (credentials) => {
  let authResponse = await authenticate(credentials)  
  let accessToken = authResponse.data?.access_token  // resposta com access token recebe o nome access_token

  return axios.create({
    baseURL: process.env.GN_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
}

module.exports = GNRequest