import express from 'express'
import { asyncHandler } from '../getSendResult'
import { getBooks, getBookById, addBook } from '../../services/bookService'

const router = express.Router();

router.get('/', asyncHandler(
    async (req, res) => {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        return await getBooks({ page, limit })
    }
))

router.get('/:id', asyncHandler(
    async (req, res) => {
        return await getBookById(req.params.id)
    }
))

router.post('/', asyncHandler(
    async (req, res) => {
        return await addBook(req.body)
    }
))

export default router