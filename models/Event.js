const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["sport", "travel", "conference", "business", "festival", "music"],
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  ticketsAvailable: {
    type: Number,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
});

const Events = mongoose.model("Events", EventSchema);
module.exports = Events;
