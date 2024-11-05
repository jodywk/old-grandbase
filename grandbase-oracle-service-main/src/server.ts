import express, { type Request, type Response } from 'express'
import cors from 'cors'
import users from './routes/users.route'
import resources from './routes/resource.route'
import expressStatusMonitor from 'express-status-monitor'

const app = express()

app.use(cors())
app.use(expressStatusMonitor())
app.use(express.json())

app.use('/service/v1/users', users)
app.use('/service/v1/data', resources)

app.get('/', (req, res) => {
  res.send('Status: Healthy');
})

app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'not found' })
})

export default app
