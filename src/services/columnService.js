
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }

    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if ( getNewColumn )
    {
      //xử lý cấu trúc data ở đây trước khi trả về cho frontend
      getNewColumn.cards = []

      // cập nhật mảng columnIds trong collection board
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn)
    {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }

    // delete column
    await columnModel.deleteOneById(columnId)

    // delete all cards within the column
    await cardModel.deleteManyByColumnId(columnId)

    // delete columnId in columnOrderIds array of board that contains it
    await boardModel.pullColumnOrderIds(targetColumn)
    return { deleteResult: 'Column and its cards deleted successfully' }
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}
