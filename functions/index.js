const functions = require('firebase-functions');
const request = require('request-promise');
const express = require('express');
const line = require('@line/bot-sdk');
const cors = require('cors');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const employeesDB = require('./models/employee.json')
require('dotenv').config()



const config = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret
  };
const client = new line.Client(config);
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



app.post('/', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});
app.post('/sendTask', (req, res) => {
  pushAssignTask();

});
app.get('/employees', (req, res) => {
  res.json(employeesDB)
  // res.json(employees)
})
app.post('/employees', (req, res) => {
  employeesDB.push(req.body)
  let json = req.body
  res.send('Add new user '+json.username+' completed.')
})
const LineBot = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}` // prepend '/' to keep query params if any
  }
  return app(request, response)
})


function pushAssignTask() {
  client.pushMessage('Uf273a98b44c03789e5f37d43dab4e5e4', { type: 'text', text: 'มีงานจ้า' })
}
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    var userId = event.source.userId;
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: event.message.text
    });
  }

  function getUserInfo(){
    // client
    //   .getProfile("<userId>")
    //   .then((profile) => {
    //     console.log(profile.displayName);
    //     console.log(profile.userId);
    //     console.log(profile.pictureUrl);
    //     console.log(profile.statusMessage);
    //   })
    //   .catch((err) => {
    //     // error handling
    //   });
  }

  module.exports = {
    LineBot
  }
  // exports.LineBot = functions.https.onRequest(app);

