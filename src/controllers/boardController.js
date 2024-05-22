import { StatusCodes } from 'http-status-codes'

const createNew = (req, res, next) => {
  try {
    console.log('req.body: ', req.body)
    console.log('req.query: ', req.query)
    console.log('req.params: ', req.params)
    console.log('req.files: ', req.files)
    console.log('req.cookies: ', req.cookies)
    console.log('req.jwtDecoded: ', req.jwtDecoded)

    // Navigate data to the service layer

    // if there is a result, return the result to client
    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: APIs create new boards' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      {
        errors: error.message
      })
  }
}

export const boardController = {
  createNew
}
