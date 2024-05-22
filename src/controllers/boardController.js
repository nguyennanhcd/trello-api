import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
import { findIndexById } from '~/models/boardModel'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)
    // console.log('req.query: ', req.query)
    // console.log('req.params: ', req.params)
    // console.log('req.files: ', req.files)
    // console.log('req.cookies: ', req.cookies)
    // console.log('req.jwtDecoded: ', req.jwtDecoded)

    // Navigate data to the service layer
    const createBoard = await boardService.createNew(req.body)

    // if there is a result, return the result to client
    res.status(StatusCodes.CREATED).json(createBoard)

  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}
