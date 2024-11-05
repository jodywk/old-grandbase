
import express from 'express'
import * as Contracts from '../controllers/contracts.controller'

const router = express.Router()

// collaterals
router.get('/', Contracts.api_getAll)
router.post('/', Contracts.api_create)
router.get('/:id', Contracts.api_getOne)
router.put('/:id', Contracts.api_update)
router.delete('/:id', Contracts.api_delete)

export default router