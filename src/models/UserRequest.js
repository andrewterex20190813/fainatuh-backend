import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserRequestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    phone: {
      type: String,
      required: false,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

//mongoose.set("useCreateIndex", true);
//UserRequestSchema.plugin(uniqueValidator);

export default mongoose.model("UserRequest", UserRequestSchema);
