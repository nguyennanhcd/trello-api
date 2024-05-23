/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import slugify from '~/utils/formatter'
import { cloneDeep } from 'lodash'

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
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())

      // cách 2, cách dùng này là bởi vì ObjectId trong mongodb có hỗ trợ equals
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}
