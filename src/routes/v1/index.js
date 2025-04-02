import express from 'express'
import { API_ROUTER_CONSTANTS } from '../../utils/constants/apiRoutes.constants.js'
import authRoutes from '../v1/auth/index.js'
import classRoutes from '../v1/classes/index.js'

const router = express.Router()

router.use(API_ROUTER_CONSTANTS.API_AUTH, authRoutes)
router.use(API_ROUTER_CONSTANTS.API_CLASSES, classRoutes)


export default router
