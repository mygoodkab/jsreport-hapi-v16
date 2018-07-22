
import * as Hapi from 'hapi';
import * as HapiAuth from 'hapi-auth-jwt2';
import * as hapiMongodb from 'hapi-mongodb';
import * as hapiRouter from 'hapi-router';
import * as hapiSwagger from 'hapi-swagger';
import * as inert from 'inert';
import * as vision from 'vision';
import { Util } from './util';
import * as dotenv from 'dotenv';
dotenv.config();
import { config } from './config';
const autoRoute = { dir: process.cwd() + "/dist/routes" };
const project = require('./../package');
const protocol = process.env.PROTOCOL || 'http';
const swaggerOptions = {
    auth: false,
    schemes: [protocol],
    host: process.env.HOST || 'localhost:3001',
    info: {
        title: '1 Stop Jewelry API - Report',
        version: project.version,
    },
    documentationPath: '/docs',
    securityDefinitions: {
        jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    security: [{ jwt: [] }]
};
const server = new Hapi.Server();
const optionsMongo = {
    url: process.env.MONGO || 'mongodb://admin:admin1234@ds247670.mlab.com:47670/one-stop-jewelry-dev',
    // url: 'mongodb://localhost:27017/db',
    settings: {
        poolSize: 10
    },
    decorate: true
}


server.connection({ port: 3001, host: 'localhost' });

server.register([
    {
        register: require('hapi-mongodb'),
        options: optionsMongo
    },
    inert,
    vision,
    {
        register: require('hapi-auto-route'),
        options: autoRoute
    },
    {
        register: require('hapi-swagger'),
        options: swaggerOptions
    },

], (error: any) => {

    if (error) throw error

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
    // Event 'request'
    server.on('request', (request: any, event: any, tags: any) => {
        if (tags.error) {
            // tslint:disable-next-line:no-console
            console.log(`Request ${event.request} error: ${event.error ? event.error.message : 'unknown'}`);
        }
    });
    // Event 'response'
    server.on('response', (request: any) => {
        console.log(`IP Address : ${request.info.remoteAddress} ${request.method.toUpperCase()} ${request.url.path} | Status code : ${request.response.statusCode} | Respond Time : ${(request.info.responded - request.info.received)} ms`);
    });




    function validate(decoded, request, callback) {
        return callback(null, true);

    }
})
