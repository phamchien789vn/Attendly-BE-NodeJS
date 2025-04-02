import express from 'express'
import { API_ROUTER_CONSTANTS } from '../utils/constants/apiRoutes.constants.js'
import apiVersion1 from './v1/index.js'

const router = express.Router()

router.use(API_ROUTER_CONSTANTS.API_VERSION_V1, apiVersion1)

export default router
