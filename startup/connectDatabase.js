import mongoose from 'mongoose'
import createDebug from 'debug'
const debug = createDebug('a2:db')

export default function () {
  mongoose
    .connect(`mongodb://localhost:27017/mongoCrud`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      debug(`Connected to MongoDB ...`)
    })
    .catch(err => {
      debug(`Error connecting to MongoDB ...`, err.message)
      process.exit(1)
    })
}