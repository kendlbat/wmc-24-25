import request from 'supertest';
import assert from 'assert';
import server from '../../server.js';
import { fillFacilityData, fillEmployeeData } from '../../db/fill-data.js';

describe('Employees - GET', () => {

    before(async () => {
        await server.dropCurrentDatabase();
        await fillFacilityData();
        await fillEmployeeData();
    });

    describe('/GET employees', async () => {
        it('it should return 186 employees', async () => {
            const getResponse = await request(server)
                .get('/api/employees')
                .expect(200)
                .expect('Content-Type', /json/);

            assert.equal(getResponse.body.length, 186);
        });

        it('it should report the number of results in response header', async () => {
            await request(server)
                .get('/api/employees')
                .expect(200)
                .expect('x-num-results', '186');
        });

        it('it should return the employees sorted by lastname and firstname', async () => {
            const getResponse = await request(server)
                .get('/api/employees')
                .expect(200)
                .expect('Content-Type', /json/);

            assert.equal(getResponse.body[100].firstName, 'Leon');
            assert.equal(getResponse.body[100].lastName, 'Meyer');
        });
    });

    describe('/GET employees?limit=10&offset=0', async () => {
        it('it should return the first 10 employees', async () => {
            const getResponse = await request(server)
                .get('/api/employees?limit=10&offset=0')
                .expect(200)
                .expect('Content-Type', /json/);

            assert.equal(getResponse.body.length, 10);
            assert.equal(getResponse.body[0].firstName, 'Hans');
            assert.equal(getResponse.body[0].lastName, 'Bauer');
            assert.equal(getResponse.body[9].firstName, 'Leon');
            assert.equal(getResponse.body[9].lastName, 'Becker');
        });

        it('it should report the number of results in response header', async () => {
            await request(server)
                .get('/api/employees?limit=10&offset=0')
                .expect(200)
                .expect('x-num-results', '186');
        });
    });

    describe('/GET employees?limit=20&offset=40', async () => {
        it('it should return the third 20 employees', async () => {
            const getResponse = await request(server)
                .get('/api/employees?limit=20&offset=40')
                .expect(200)
                .expect('Content-Type', /json/);

            assert.equal(getResponse.body.length, 20);
            assert.equal(getResponse.body[0].firstName, 'Sara');
            assert.equal(getResponse.body[0].lastName, 'Fischer');
            assert.equal(getResponse.body[19].firstName, 'Hans');
            assert.equal(getResponse.body[19].lastName, 'Hofmann');
        });

        it('it should report the number of results in response header', async () => {
            await request(server)
                .get('/api/employees?limit=10&offset=0')
                .expect(200)
                .expect('x-num-results', '186');
        });
    });


    describe('/GET employees?limit=20&offset=200', async () => {
        it('it should return the third 20 employees', async () => {
            const getResponse = await request(server)
                .get('/api/employees?limit=20&offset=200')
                .expect(200)
                .expect('Content-Type', /json/);

            assert.equal(getResponse.body.length, 0);
        });

        it('it should report the number of results in response header', async () => {
            await request(server)
                .get('/api/employees?limit=10&offset=0')
                .expect(200)
                .expect('x-num-results', '186');
        });
    });

    describe('/GET employees?limit=-10&offset=0', async () => {
        it('it should report a bad request for a negative limit', async () => {
            await request(server)
                .get('/api/employees?limit=-1&offset=0')
                .expect(400);
        });
    });

    describe('/GET employees?limit=20&offset=-10', async () => {
        it('it should report a bad request for a negative offset', async () => {
            await request(server)
                .get('/api/employees?limit=20&offset=-10')
                .expect(400);
        });
    });

    describe('/GET employees?limit=2&offset=2&firstName=Hans', async () => {
        it('it should return the employees 3+4 called Hans', async () => {
            const getResponse = await request(server)
                .get('/api/employees?limit=2&offset=2&firstName=Hans')
                .expect(200)
                .expect('Content-Type', /json/);

            assert.equal(getResponse.body.length, 2);
            assert.equal(getResponse.body[0].lastName, 'Fischer');
            assert.equal(typeof getResponse.body[0].currentFacility, 'string');
            assert.equal(getResponse.body[1].lastName, 'Hoffmann');
            assert.equal(typeof getResponse.body[1].currentFacility, 'string');
        });

        it('it should report the number of results in response header', async () => {
            await request(server)
                .get('/api/employees?limit=2&offset=2&firstName=Hans')
                .expect(200)
                .expect('x-num-results', '6');
        });
    });

    describe('/GET employees?embed=(currentFacility)', async () => {
        it('it should return the employees including the embedded currentFacility object', async () => {
            const getResponse = await request(server)
                .get('/api/employees?embed=(currentFacility)')
                .expect(200)
                .expect('Content-Type', /json/);

            assert.equal(getResponse.body.length, 186);
            assert.equal(typeof getResponse.body[0].currentFacility, 'object');
            assert.equal(typeof getResponse.body[1].currentFacility, 'object');
        });
    });
});
