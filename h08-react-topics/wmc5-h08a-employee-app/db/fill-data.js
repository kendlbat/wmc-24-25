import { promises as fsp } from 'fs';

import { logger } from '../logging.js';

import { Facility } from '../api/facilities/facilities-model.js';
import { Employee } from '../api/employees/employees-model.js';

async function fillFacilityData(fileName = 'data/facilities.json') {
    let allFacilities = JSON.parse(await fsp.readFile(fileName));

    let successCnt = 0;
    let errorCnt = 0;

    for (let facility of allFacilities) {
        try {
            await Facility.create(facility);
            successCnt++;
        }
        catch (err) {
            errorCnt++;
        }
    }

    logger.info(`Facility data - ${successCnt} facilities successfully imported, ${errorCnt} facilities contain errors`);
}

async function fillEmployeeData(fileName = 'data/employees.json') {
    let allEmployees = JSON.parse(await fsp.readFile(fileName));

    let successCnt = 0;
    let errorCnt = 0;

    for (let employee of allEmployees) {
        try {
            let facility = await Facility.findOne({ title: employee.facility })
            await Employee.create({ ...employee, currentFacility: facility._id });
            successCnt++;
        }
        catch (err) {
            errorCnt++;
        }
    }

    logger.info(`Employee data - ${successCnt} employees successfully imported, ${errorCnt} employees contain errors`);

}

export { fillFacilityData, fillEmployeeData }