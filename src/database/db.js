import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose.connect(process.env.MONGO_URI, {
    dbName: "MERN_AUTHENTICATION"
  }).then(() => {
    console.log("Connect to database")
  }).catch((err) => {
    console.error(`Some error occured while connecting to database: ${err}`)
  })
}