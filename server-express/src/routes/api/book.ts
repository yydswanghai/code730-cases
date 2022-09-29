import express from 'express'
import { asyncHandler } from '../getSendResult'
import { getBooks, getBookById, addBook } from '../../services/bookService'

const router = express.Router();

router.get('/', asyncHandler(
    async (req, res) => {
        const page = +req.query.page || 1;
        const pageSize = +req.query.pageSize || 10;
        return await getBooks({ page, pageSize })
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