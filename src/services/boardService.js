/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import slugify from '~/utils/formatter'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {

  try {
    // xử lý logic dữ liệu tùy dữ liệu dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Call to model layer to handle registration of newBoard into database
    const createdBoard = await boardModel.createNew(newBoard)

    // lấy bản ghi board sau khi gọi ( tùy mục đích dự án mà có cần bước này hay không )
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // làm thêm các xử lý logic khác với các collection khác tùy đặc thù dự án ...
    // Bắn email, notifications về cho admin khi có 1 cái board mới được tạo...

    // trả kết quả về trong service luôn luôn phải có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    // cloneDeep board ra 1 cái mới để xử lý không ảnh hưởng tới board ban đầu, tùy cần clone hay không
    const resBoard = cloneDeep(board)
    // đưa card về đúng column của nó

    resBoard.columns.forEach(column => {
      // card.columnId.toString() là bởi vì ban đầu nó là kiểu objectId của mongoDb
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())

      // cách 2, cách dùng này là bởi vì ObjectId trong mongodb có hỗ trợ equals
      // column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    //Step 1: Update cardOrderIds array of the first column that owns the card (  basically it's just remove the _id of that Card )
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    //Step 2: Update cardOrderIds of the next column that owns the card ( basically it's just add _id of card )
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    console.log(reqBody)
    //Step 3: Update the new columnId field of the dragged card
    cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })
    return { updateResult: 'Successfully' }

  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
