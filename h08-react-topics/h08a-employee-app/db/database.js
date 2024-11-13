import mongoose from 'mongoose';
import { logger } from '../logging.js';

const dbConnectTimeout = 5000;

async function setupDBConnection(connectionString, recreateDatabase) {

    try {

        // BTW... bad practice to log connection strings including passwords ...
        logger.info(`DB - Setting up connection using ${connectionString}`);

        if (recreateDatabase) {
            logger.info(`DB - Start dropping current database`);
            await dropCurrentDatabase(connectionString);
            logger.info('DB - Current database dropped !!');
        }

        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: dbConnectTimeout,
        });

        logger.info(`DB - Connection to ${connectionString} established.`);
    }
    catch (err) {
        logger.error('DB - Unable to setup connection... ', err);
        process.exit(1);
    }
}

async function dropCurrentDatabase(connectionString) {
    let connection = await mongoose.createConnection(connectionString, {
        serverSelectionTimeoutMS: dbConnectTimeout
    }).asPromise();
    await connection.dropDatabase();
}


export { setupDBConnection, dropCurrentDatabase };
