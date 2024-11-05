import express from 'express'
import {
  getPrices
} from '../controllers/resource.controller'

const router = express.Router()

router.get('/prices', getPrices)

export default router
