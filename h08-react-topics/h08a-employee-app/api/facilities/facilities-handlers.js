import mongoose from 'mongoose';

import { Facility } from './facilities-model.js';
import { logger } from '../../logging.js';

const getAll = async (req, resp) => {
    try {
        logger.debug(`Facilities - Fetching facilities with filter`, req.query);
        // blindly accept filter from client - never do this in production
        let resultSet = await Facility.find(req.query).sort({ title: 1, subtitle: 1 });
        resp.status(200);
        resp.json(resultSet);
    }
    catch (err) {
        logger.warn(`Facilities - Error getting facilities`, err);
        resp.status(500).send();
    }
};

const getById = async (req, resp) => {
    let facilityId = req.params.id;
    try {
        logger.debug(`Facilities - Fetch facility with id=${facilityId}`);

        let facility = await Facility.findById(facilityId);
        if (facility) {
            resp.status(200).header('etag', facility.__v).json(facility);
        }
        else {
            resp.status(404).type('text/plain').send(`Facility with id ${req.params.id} not found`);
        }
    }
    catch (err) {
        logger.warn(`Facilities - Error getting facility with id=${facilityId}`, err);
        resp.status(500).send();
    }
};

export default {
    getAll,
    getById
}