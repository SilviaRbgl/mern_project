import mongoose from "mongoose";

const { Schema } = mongoose;

const expeditionSchema = new Schema({
  island: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
    unique: false,
  },
  date: {
    beginDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  itinerary: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  leader: [{ type: Schema.Types.ObjectId, ref: "leader" }],
  favourites: {
    type: Array,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
});

const expeditionModel = mongoose.model("expedition", expeditionSchema);

export default expeditionModel;
