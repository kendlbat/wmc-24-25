import mongoose from "mongoose";

import { Employee } from "./employees-model.js";
import { logger } from "../../logging.js";

const getAll = async (req, resp) => {
    let { firstName, lastName, email, currentFacility, embed, limit, offset } =
        req.query;

    try {
        logger.debug(`Employees - Fetching employees with filter`, req.query);

        let filter = {};

        if (firstName) filter.firstName = firstName;
        if (lastName) filter.lastName = lastName;
        if (email) filter.email = email;
        if (currentFacility) filter.currentFacility = currentFacility;
        if (parseInt(limit) < 0) return resp.status(400).send("Invalid limit");
        if (parseInt(offset) < 0)
            return resp.status(400).send("Invalid offset");

        let query = Employee.find(filter, null, {
            sort: {
                lastName: 1,
                firstName: 1,
            },
            limit: limit,
            skip: offset,
        });

        // Embed is in the form of "(currentFacility,department)"
        if (embed && embed.match(/^\(.*\)$/)) {
            let embedFields = embed
                .replace(/^\(/, "")
                .replace(/\)$/, "")
                .split(",");
            embedFields.forEach((field) => {
                query.populate(field);
            });
        }

        let numResults = await Employee.countDocuments(filter);
        resp.status(200)
            .set("x-num-results", numResults)
            .json(await query);
    } catch (err) {
        logger.warn(err);
        resp.status(500).send();
    }
};

const getById = async (req, resp) => {
    try {
        let employeeId = req.params.id;
        logger.debug(`Employees - Fetch employee with id=${employeeId}`);

        let employee = await Employee.findById(employeeId);
        if (employee) {
            resp.status(200).json(employee);
        } else {
            resp.status(404)
                .type("text/plain")
                .send(`Employee with id ${req.params.id} not found`);
        }
    } catch (err) {
        logger.warn(err);
        resp.status(500).send();
    }
};

export default {
    getAll,
    getById,
};
