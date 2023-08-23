import { MongoClient, ServerApiVersion } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

let uri = process.env.MONGODB_URI  

const options = {
  // serverApi: {
  //   version: ServerApiVersion.v1,
  //   strict: true,
  //   deprecationErrors: true,
  // },
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

let client
let clientPromise
if (process.env.NODE_ENV === 'development') {  
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
  //throw new Error('Logging OK'+JSON.stringify(global._mongoClientPromise))
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
  console.log(">>> ",clientPromise)
}

export default clientPromise
