import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  /*
    In default, we don't need to custom message in BE side because frontend need to validate and custom message to beautify the UI
    BE just only need to validate and make sure data is concise, and message is not required to be beautiful
    *Important: Validation is compulsory at backend because this is the last step to save data into database
    And casually, the best options is to validate at both frontend and backend
  */
  const correctCondition = Joi.object({
    //trim() must use with strict()
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title need to have at least 3 characters',
      'string.max': 'Title containing a maximum of 50 characters',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description is not allowed to be empty',
      'string.min': 'Description need to have at least 3 characters',
      'string.max': 'Description containing a maximum of 50 characters',
      'string.trim': 'Description must not have leading or trailing whitespace'
    })
  })

  try {
    // console.log('req.body: ', req.body)
    // set abortEarly to false to continue printing the errors if there are more than 2 errors
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // next()
    res.status(StatusCodes.CREATED).json({ message: 'POST form validation: APIs create new boards' })
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(
      {
        errors: new Error(error).message
      })
  }
}

export const boardValidation = {
  createNew
}