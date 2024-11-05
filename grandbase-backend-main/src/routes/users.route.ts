import express from 'express'
import {
  getNonce,
  validateSignature,
  updateNonce,
  logout
} from '../controllers/users.controller'

const router = express.Router()

router.post('/validate', validateSignature)
router.post('/nonce/', updateNonce)
// router.get('/nonce/:wallet_address', getNonce)
router.get('/nonce', getNonce)
router.get('/logout', logout);


export default router
