import { monitor } from '@colyseus/monitor'
import { Server } from 'colyseus'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import { Trysts } from './rooms/Trysts'

const port = Number(process.env.PORT) || 2567

const app = express()
app.use(cors())
app.use(express.json())

const gameServer = new Server({
  server: createServer(app),
})

gameServer.define('trysts', Trysts).enableRealtimeListing()

app.use('/colyseus', monitor())

gameServer.listen(port)
console.log(`Listening on ws://localhost:${port}`)

