
import express from 'express'
import * as MasterLps from '../controllers/masterlps.controller'

const router = express.Router()

// collaterals
router.get('/', MasterLps.api_getAll)
router.post('/', MasterLps.api_create)
router.get('/:id', MasterLps.api_getOne)
router.put('/:id', MasterLps.api_update)
router.delete('/:id', MasterLps.api_delete)

export default router