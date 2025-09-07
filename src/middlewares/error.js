import ErrorHandler from "../utils/errorHandler.js"

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Internal server error"

  // Mongoose Bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id: ${err.value}`
    err = new ErrorHandler(message, 400)
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Token is invalid, Try again`
    err = new ErrorHandler(message, 400)
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token is expire, Try again"
    err = new ErrorHandler(message, 400)
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
    err = new ErrorHandler(message, 400)
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message).join(", ")
    err = new ErrorHandler(message, 400)
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  })
}
