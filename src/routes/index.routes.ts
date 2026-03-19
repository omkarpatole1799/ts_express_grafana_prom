import express from 'express'
import { register } from '../controllers/index.controller'

const indexRouter = express.Router()

indexRouter.post('/register',register)

export default indexRouter