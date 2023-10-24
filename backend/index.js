require('dotenv').config();
const express = require('express');
const app = express();
const appPort = 3000;
const wsPort = 7071;
const mqtt = require('mqtt');
const WebSocket = require('ws');

let clients = [];

let wss;
const mqttClient = mqtt.connect('mqtt://' + process.env.LOCAL_IP);
mqttClient.on('connect', () => {
    console.log('Connected to mqtt broker at IP: ' + process.env.LOCAL_IP);
    wss = new WebSocket.Server({ port: wsPort });
    console.log('Initialized WebSocket server at port ' + wsPort);

    wss.on('connection', (ws) => {
        clients.push(ws);
        ws.on('close', () => {
            clients = clients.filter(x => x !== ws)
        });
    });
});

let savingDataToDatabaseFlag = false;
mqttClient.on('message', (topic, message) => {
    clients.forEach(client => {
        client.send(message.toString());
    })
    console.log('sending msg to all clients: ' + message.toString());
});

app.get('/', (req, res) => {
    res.send('Hello world!');
})

app.post('/api/start', (req, res) => {
    console.log('starting to pass all incoming data through websockets');
    savingDataToDatabaseFlag = true;
    mqttClient.subscribe('esp8266_data', (err) => {
        if (err) {
            res.status(500).send('An error occured while subscribing to topic \"esp8266_data\"');
        }
    });
    res.status(200).send('Successfully subscribed to topic \"esp8266_data\"');
})
app.post('/api/stop', (req, res) => {
    console.log('stopping all websockets connections');
    clients.forEach(ws => {
        ws.close();
    })
    clients = [];
    savingDataToDatabaseFlag = false;
    mqttClient.unsubscribe('esp8266_data');
    res.send('Unsubscribed to topic \"esp8266_data\"');
})

app.listen(appPort, () => {
    console.log('listening at port ' + appPort);
});

