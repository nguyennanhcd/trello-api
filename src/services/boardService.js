/* eslint-disable no-useless-catch */
import slugify from '~/utils/formatter'

const createNew = async (reqBody) => {

  try {
    // xử lý logic dữ liệu tùy dữ liệu dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Call to model layer to handle registration of newBoard into database

    // làm thêm các xử lý logic khác với các collection khác tùy đặc thù dự án ...
    // Bắn email, notifications về cho admin khi có 1 cái board mới được tạo...

    // trả kết quả về trong service luôn luôn phải có return
    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}