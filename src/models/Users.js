import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto"

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [20, "Name cannot exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    // match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    // match: [
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    // ]
  },
  phone: {
    type: String,
    unique: true,
    // match: [
    //   /^(\+92|0)?3\d{9}$/,
    //   "Please enter a valid Pakistani phone number"
    // ]
  },
  accountVerified: {
    type: Boolean,
    default: false,
    required: true
  },
  verificationCode: {
    type: Number
  },
  verificationCodeExpire: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  }
},
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password
        return ret
      }
    }
  }
)

// Indexes for better query performance
UserSchema.index({ email: 1 })
UserSchema.index({ createdAt: -1 })

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  };
  this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password)
}

UserSchema.methods.generateVerificationCode = function () {
  // function generateRandomFiveDigitNumber() {
  //   const firstDigit = Math.floor(Math.random() * 9) + 1
  //   const remainingDigit = Math.floor(Math.random() * 10000).toString().padStart(4, 0)

  //   return parseInt(firstDigit + remainingDigit)
  // }
  // const verificationCode = generateRandomFiveDigitNumber();
  const verificationCode = crypto.randomInt(10000, 99999)
  this.verificationCode = verificationCode
  this.verificationCodeExpire = Date.now() + 5 * 60 * 1000

  return verificationCode
}

const User = mongoose.models.Users || mongoose.model("Users", UserSchema)

export default User;