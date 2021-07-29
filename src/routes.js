const routes = require('express').Router()
const GNRequest = require('./apis/gerencianet');

const reqGNAlready = GNRequest({
    clientID: process.env.GN_CLIENT_ID,
    clientSecret: process.env.GN_CLIENT_SECRET
  });

  
routes.get('/', async (req, res) => {
   try{ const reqGN = await reqGNAlready;
    const dataCob = {
      calendario: {
        expiracao: 3600
      },
      valor: {
        original: '0.10'
      },
      chave: '126bec4a-2eb6-4b79-a045-78db68412899',
      solicitacaoPagador: 'Cobrança dos serviços prestados.'
    };
  
    const cobResponse = await reqGN.post('/v2/cob', dataCob);
    const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);
  
   return res.render('qrcode', { qrcodeImage: qrcodeResponse.data.imagemQrcode })
  }
  catch (error) {
    return res.send(400).json('invalid Request')
  }
  });
  
  routes.get('/cobrancas', async(req, res) => {
   try{ const reqGN = await reqGNAlready;
  
    const cobResponse = await reqGN.get('/v2/cob?inicio=2021-02-15T16:01:35Z&fim=2021-02-22T23:59:00Z');
  
    return res.send(cobResponse.data)
   }
   catch (error) {
    return res.send(400).json('invalid Request')
   }
  });
  
  routes.post('/webhook(/pix)?', (req, res) => {
  try{  console.log(req.body);
    return res.send(200).json('Success')
   }
    catch (error) {
      return res.send(400).json('invalid request')
    }
  })


  module.exports = routes