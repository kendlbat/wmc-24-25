import mongoose from 'mongoose';

const facilitiesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zipCode: {
    type: Number,
    min: 0,
    max: 99999,
    required: true
  },
  street: {
    type: String,
    required: true
  }
});

const Facility = mongoose.model('facilities', facilitiesSchema);

export { Facility };

