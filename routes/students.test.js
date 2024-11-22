const {describe, expect, test} = require("@jest/globals");

// supertest is a framework that allows to easily test web APIs
const supertest = require('supertest');
const app = require('./../app');
const request = supertest(app);

describe('REST APIs for students', () => {
    describe('GET /students', () => {
        test(`should return a 200 (ok) status code`, async () => {
            const response = await request.get('/students');
            expect(response.status).toBe(200);

        });
        test(`should have Content-type "application/json"`, async () => {
            const response = await request.get(`/students`);

            expect(response.header[`content-type`]).toMatch(/application\/json/);
        });
        test(`should have the correct student as JSON`, async() =>
        {

            const response = await request.get(`/students/1`);
            const actual_response_content_as_json = response.body;

            const expected_response_as_json = {
                id: 1,
                firstName: `Alice`,
                lastName: `Agnesi`,
                birthDate: `1991-01-01`

            };
            expect(actual_response_content_as_json).toEqual(expected_response_as_json);
        });
        test('should contain the key "first_name" in the first student returned as a JSON response', async () => {
            const response = await request.get('/students');
            const response_content_as_json = response.body;

            expect(response_content_as_json[0]).toHaveProperty('firstName');
        });
        test(`first firstName returned should contain Alice as JSON response`, async () => {
            const response = await request.get(`/students`);
            const response_content_as_json = response.body;

            expect(response_content_as_json[0].firstName).toBe(`Alice`);
        });
    });

    describe('GET /students/:id', () => {
        // TODO: add your tests
        test(`should return a 200 status code`, async () => {
            const response = await request.get(`/students/1`);
            expect(response.status).toBe(200);
        });

        test(`should have Content-Type "application/json"`, async () => {
            const response = await request.get(`/students/1`);
            expect(response.header['content-type']).toMatch(/application\/json/);
        });
    });

    describe('POST /students', () => {
        // TODO: add your tests
    });

    describe('PUT /students/:id', () => {
        // TODO: add your tests
    });

    describe('PATCH /students/:id', () => {
        // TODO: add your tests
    });

    describe('DELETE /students/:id', () => {
        // TODO: add your tests
    });
})
;
