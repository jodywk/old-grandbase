
import express from 'express'
import * as liquidation from '../controllers/liquidation.controller'

const router = express.Router()

// collaterals
router.get('/', liquidation.api_getAll)

export default router