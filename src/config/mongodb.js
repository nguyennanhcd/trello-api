import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

// initialize trelloDatabase as null at first ( becasue it has not connected yet)
let trelloDatabaseInstance = null

// initialize client instance to connect to mongodb server
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  // lưu ý casci serverAPI có từ phiên bản MongoDB 5.0.0 trở lên, có thể không cần dùng nó,
  // còn nếu dùng nó là chúng ta sẽ chỉ định 1 cái stableAPI version của MongoDB
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
}
)

// connect to db
export const CONNECT_DB = async () => {

  // call a connection to MongoDB Atlas with the URI declared in the body of mongoClientInstance
  await mongoClientInstance.connect()

  // if connection is successful, take out the database by the name and assign it to trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

// make sure that this function ( GET_DB ) is called only when the connection to MongoDB is established
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to database first')
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}