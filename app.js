import express from "express"
import http from "http"
import { Server } from "socket.io"
import path from "path"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(express.static(path.join(process.cwd(), "public")))

let logs = []

app.post("/webhook", (req, res) => {
  const payload = req.body
  logs.push(payload)
  io.emit("new_notif", payload)

  setTimeout(() => {
    logs = logs.filter(item => item !== payload)
  }, 300000)

  res.status(200).json({ status: "ok" })
})

app.get("/logs", (req, res) => {
  res.status(200).json(logs)
})

io.on("connection", (socket) => {
  socket.emit("all_notif", logs)
})

server.listen(3000)
