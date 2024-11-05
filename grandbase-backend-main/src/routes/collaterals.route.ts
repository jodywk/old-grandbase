
import express from 'express'
import * as Collaterals from '../controllers/collaterals.controller'

const router = express.Router()

// collaterals
router.get('/', Collaterals.api_getAll)
router.post('/', Collaterals.api_create)
router.get('/:id', Collaterals.api_getOne)
router.put('/:id', Collaterals.api_update)
router.delete('/:id', Collaterals.api_delete)

export default router