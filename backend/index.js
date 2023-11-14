const { ReadingType } = require("@prisma/client");
require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const appPort = 3000;
const wsPort = 7071;
const mqtt = require("mqtt");
const WebSocket = require("ws");

let savingDataFlag = false;
let clients = [];
let wss;
let currentSessionId = undefined;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// eslint-disable-next-line no-undef
const mqttClient = mqtt.connect("mqtt://" + process.env.LOCAL_IP);
mqttClient.on("connect", () => {
  // eslint-disable-next-line no-undef
  console.log("Connected to mqtt broker at IP: " + process.env.LOCAL_IP);
  wss = new WebSocket.Server({ port: wsPort });
  console.log("Initialized WebSocket server at port " + wsPort);

  wss.on("connection", (ws) => {
    clients.push(ws);
    ws.on("close", () => {
      clients = clients.filter((x) => x !== ws);
    });
  });
});

mqttClient.on("message", async (topic, message) => {
  //TODO: decide whether that name fits and if it should be left that this flag controls not only saving to DB but also sending live data through WS
  if (savingDataFlag) {
    const parsedMessage = JSON.parse(message);
    if (Array.isArray(parsedMessage)) {
      parsedMessage.forEach(async (reading) => {
        try {
          console.log("creating sensorReading: ", {
            sessionId: currentSessionId,
            sensorName: reading.sensorName,
            value: reading.reading,
            type: reading.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
          });
          await prisma.smokingSensorReading.create({
            data: {
              sessionId: currentSessionId,
              sensorName: reading.sensorName,
              value: reading.reading,
              type: reading.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
            },
          });
        } catch (e) {
          console.log(e.message);
          //ignore
        }
      });
    } else {
      try {
        console.log("creating sensorReading: ", {
          sessionId: currentSessionId,
          sensorName: parsedMessage.sensorName,
          value: parsedMessage.reading,
          type:
            parsedMessage.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
        });
        await prisma.smokingSensorReading.create({
          data: {
            sessionId: currentSessionId,
            sensorName: parsedMessage.sensorName,
            value: parsedMessage.reading,
            type:
              parsedMessage.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
          },
        });
      } catch (e) {
        console.log(e.message);
        //ignore
      }
    }
    clients.forEach((client) => {
      client.send(message.toString());
    });
    console.log("sending msg to all clients");
  }
});

app.get("/", (req, res) => {
  res.send("im not a teapot");
});

app.post("/api/start", async (req, res) => {
  //TODO: think about any kind of identity validation, maybe decode jwt token, tbd
  if (!req.body.authorId) {
    console.log(req.body);
    return res.status(404).send("Forbidden");
  }

  console.log("starting to pass all incoming data through websockets");
  mqttClient.subscribe("esp8266_data", (err) => {
    if (err) {
      return res
        .status(500)
        .send('An error occured while subscribing to topic "esp8266_data"');
    }
  });
  savingDataFlag = true;
  try {
    const newSession = await prisma.smokingSession.create({
      data: { authorId: req.body.authorId },
    });
    currentSessionId = newSession.id;
    console.log(savingDataFlag, currentSessionId);
    if (!currentSessionId) {
      return res.status(500).send("Error creating session");
    }
  } catch (e) {
    console.log(e.message);
    savingDataFlag = false;
    currentSessionId = undefined;
    return res.status(500).send("Error creating session");
  }
  res.status(200).send('Successfully subscribed to topic "esp8266_data"');
});
app.post("/api/stop", (req, res) => {
  //TODO: think about any kind of identity validation, maybe decode jwt token, tbd
  console.log("stopping all websockets connections");
  clients.forEach((ws) => {
    ws.close();
  });
  clients = [];
  savingDataFlag = false;
  mqttClient.unsubscribe("esp8266_data");
  res.send('Unsubscribed to topic "esp8266_data"');
});

app.listen(appPort, () => {
  console.log("listening at port " + appPort);
});
