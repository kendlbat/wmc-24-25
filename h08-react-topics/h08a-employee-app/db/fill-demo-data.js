

import mongoose from 'mongoose';

import { logger } from '../logging.js';
import { setupDBConnection } from './database.js';
import { fillFacilityData, fillEmployeeData } from './fill-data.js';

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1/ex-employee-app';

fillDatabase();

async function fillDatabase() {
    await setupDBConnection(MONGODB_CONNECTION_STRING, true);

    logger.info('Starting filling database with demo data...');
    
    await fillFacilityData();
    await fillEmployeeData();
    
    logger.info('Finished filling database!')
    await mongoose.disconnect();
}

