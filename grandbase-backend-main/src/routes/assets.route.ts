
import express from 'express'
import * as Assets from '../controllers/assets.controller'

const router = express.Router()

// collaterals
router.get('/', Assets.api_getAll)
router.post('/', Assets.api_create)
router.get('/:id', Assets.api_getOne)
router.put('/:id', Assets.api_update)
router.delete('/:id', Assets.api_delete)

export default router