import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const ProfileSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true
    },
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true
    },
    lastName: {
      type: String,
      required: false,
      trim: true
    },
    address1: {
      type: String,
      required: true,
      trim: true
    },
    address2: {
      type: String,
      required: false,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    zipcode: {
      type: String,
      required: false,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: false,
      trim: true
    },
    state: {
      type: String,
      required: false,
      trim: true
    },
    passportFilePath: {
      type: String,
      required: false,
    },
    drivingLicenseFilePath: {
      type: String,
      required: false,
    },
    nothingFilePath: {
      type: String,
      required: false,
    },
    assignmentFilePath: {
      type: String,
      required: false,
    },
    otherFilePath: {
      type: String,
      required: false,
    },
    anotherFilePath: {
      type: String,
      required: false
    }

  },
  {
    timestamps: true
  }
);

mongoose.set("useCreateIndex", true);
ProfileSchema.plugin(uniqueValidator);

export default mongoose.model("Profile", ProfileSchema);
