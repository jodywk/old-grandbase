import express from 'express'
import {
  getAll,
  getPrices
} from '../controllers/resource.controller'
import CollateralsRouter from "./collaterals.route";
import AssetsRouter from "./assets.route";
import ContractsRouter from "./contracts.route";
import MasterLpsRouter from "./masterlps.route";

const router = express.Router()

router.get('/all', getAll)
router.get('/prices', getPrices)

router.use('/collaterals', CollateralsRouter)
router.use('/assets', AssetsRouter)
router.use('/contracts', ContractsRouter)
router.use('/masterlps', MasterLpsRouter)

export default router
