// những domain được phép truy cập đến tài nguyên của server
export const WHITELIST_DOMAINS = [
  'http://localhost:5173',
  'https://dngdung.vercel.app/'
  // vv... sau này sẽ thêm domain khi deploy
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}