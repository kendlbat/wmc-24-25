import mongoose from "mongoose";

const dbConnectTimeout = 5000;

async function setupDBConnection(connectionString, recreateDatabase) {
    try {
        // BTW... bad practice to log connection strings including passwords ...
        console.log(`DB - Setting up connection using ${connectionString}`);

        if (recreateDatabase) {
            await dropCurrentDatabase(connectionString);
        }

        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: dbConnectTimeout,
        });

        console.log(`DB - Connection to ${connectionString} established.`);
    } catch (err) {
        console.log("DB - Unable to setup connection... " + err.message);
        process.exit(1);
    }
}

async function dropCurrentDatabase(connectionString) {
    console.log(`DB - Start dropping current database`);

    let connection = await mongoose
        .createConnection(connectionString, {
            serverSelectionTimeoutMS: dbConnectTimeout,
        })
        .asPromise();
    await connection.dropDatabase();

    console.log("DB - Current database dropped !!");
}

export { setupDBConnection, dropCurrentDatabase };
