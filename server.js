const express = require("express");
const cluster = require("cluster");
const os = require("os");

const app = express();

const numCPUs = os.cpus();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // console.log(`${startTime} ${Date.now()} = `, Date.now() - startTime);
  }
}
app.get("/", (req, res) => {
  res.send(`Performance example ${process.pid}`);
});

app.get("/timer", (req, res) => {
  // delay response
  delay(9000);
  res.send(`Don't sleep, don't sleep, wake up ${process.pid}`);
});

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCPUs.length; i++) {
    console.log("forking workers");
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log(`Worker ${process.pid} started`);
  app.listen(3000);
}
