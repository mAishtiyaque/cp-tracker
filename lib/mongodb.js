import { MongoClient, ServerApiVersion } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

let uri = process.env.MONGODB_URI  
if (uri===undefined)
 uri= "mongodb+srv://mdaug19cs:agQutquQBHx3BGeZ@cluster0.ogsom3d.mongodb.net/?retryWrites=true&w=majority"
//uri = "mongodb://myuser:password@127.0.0.1:27017"
//uri= "mongodb://localhost:27017"
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
  //console.log("Hello ",clientPromise)
}

export default clientPromise
