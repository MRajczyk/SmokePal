const { ReadingType } = require("@prisma/client");
require("dotenv").config();
const moment = require("moment");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5000",
  })
);
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
    const timestamp = moment().utc().format();
    const parsedMessage = JSON.parse(message);
    if (Array.isArray(parsedMessage)) {
      parsedMessage.forEach(async (reading) => {
        clients.forEach((client) => {
          client.send(
            JSON.stringify({
              sessionId: currentSessionId,
              sensorName: reading.sensorName,
              value: Number.parseFloat(reading.reading),
              type: reading.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
              timestamp: timestamp,
            })
          );
        });
        try {
          console.log("creating sensorReading: ", {
            sessionId: currentSessionId,
            sensorName: reading.sensorName,
            //check whether adding error handling is advisable
            value: Number.parseFloat(reading.reading),
            type: reading.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
            timestamp: timestamp,
          });
          await prisma.smokingSensorReading.create({
            data: {
              sessionId: currentSessionId,
              sensorName: reading.sensorName,
              //check whether adding error handling is advisable
              value: Number.parseFloat(reading.reading),
              type: reading.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
              timestamp: timestamp,
            },
          });
        } catch (e) {
          console.log(e.message);
          //ignore
        }
      });
    } else {
      clients.forEach((client) => {
        client.send(
          JSON.stringify({
            sessionId: currentSessionId,
            sensorName: parsedMessage.sensorName,
            value: Number.parseFloat(parsedMessage.reading),
            type:
              parsedMessage.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
            timestamp: timestamp,
          })
        );
      });
      try {
        console.log("creating sensorReading: ", {
          sessionId: currentSessionId,
          sensorName: parsedMessage.sensorName,
          //check whether adding error handling is advisable
          value: Number.parseFloat(parsedMessage.reading),
          type:
            parsedMessage.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
          timestamp: timestamp,
        });
        await prisma.smokingSensorReading.create({
          data: {
            sessionId: currentSessionId,
            sensorName: parsedMessage.sensorName,
            //check whether adding error handling is advisable
            value: Number.parseFloat(parsedMessage.reading),
            type:
              parsedMessage.type == "TEMP" ? ReadingType.TEMP : ReadingType.HUM,
            timestamp: timestamp,
          },
        });
      } catch (e) {
        console.log(e.message);
        //ignore
      }
    }
    console.log("sending msg to all clients");
  }
});

app.get("/", (req, res) => {
  res.send("im not a teapot but im alive");
});

app.post("/api/start", async (req, res) => {
  //TODO: think about any kind of identity validation, maybe decode jwt token, tbd
  if (
    !req.body.sessionId ||
    Number.isNaN(Number.parseInt(req.body.sessionId))
  ) {
    return res.status(404).send(
      JSON.stringify({
        message: "Forbidden",
      })
    );
  }

  console.log("starting to pass all incoming data through websockets");
  mqttClient.subscribe("esp8266_data", (err) => {
    if (err) {
      return res.status(500);
    }
  });

  savingDataFlag = true;
  currentSessionId = Number.parseInt(req.body.sessionId);
  console.log(savingDataFlag, currentSessionId);

  return res.status(200).send(
    JSON.stringify({
      message: "Successfully subscribed to topic esp8266_data",
    })
  );
});
app.post("/api/stop", (req, res) => {
  //TODO: think about any kind of identity validation, maybe decode jwt token, tbd
  console.log("stopping all websockets connections");
  //TODO: I don't think closing should be handled this way, but dunno - think about mechanism to resume broadcasting
  clients.forEach((ws) => {
    ws.close();
  });
  clients = [];
  savingDataFlag = false;
  currentSessionId = undefined;
  mqttClient.unsubscribe("esp8266_data");
  return res.status(200).send(
    JSON.stringify({
      message: "Unsubscribed to topic esp8266_data",
    })
  );
});

app.listen(appPort, () => {
  console.log("listening at port " + appPort);
});
