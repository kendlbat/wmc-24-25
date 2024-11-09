import mongoose from 'mongoose';
import { Facility } from '../facilities/facilities-model.js';


const employeesSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  currentFacility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'facilities',
    required: false
  }
});

employeesSchema.index({ currentFacility: 1 }, { unique: false });
employeesSchema.index({ lastName: 1, firstName: 1 }, { unique: false });

// validation to ensure that upon insertion at least the facility with the id exists
employeesSchema.path('currentFacility').validate(
  async (value) => await Facility.findById(value),
  'Facility does not exist');

const Employee = mongoose.model('employees', employeesSchema);

export { Employee };

