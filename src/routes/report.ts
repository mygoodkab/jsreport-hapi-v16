import * as  Boom from 'boom';
import * as Joi from 'joi';
import { ObjectId } from 'mongodb';
import { Util } from '../util';
import * as jwtDecode from 'jwt-decode';
import * as request from 'request';
import { rejects } from 'assert';
import { realpathSync } from 'fs';
import * as http from 'superagent';
import * as Request from 'request-promise';
import * as fs from 'fs';
import { config } from '../config';


const mongoObjectId = ObjectId;

module.exports = [

    {
        method: 'GET',
        path: '/report/invoice',

        config: {
            auth: false,
            description: 'GET Invoice',
            notes: 'Check login',
            tags: ['api'],
            timeout: {
                server: 10 * 1000
            }
        },
        handler: async (req, reply) => {
            try {
                const mongo = Util.getDb(req);
                const payload = req.payload;
                const body = {
                    header: { 'Content-Type': 'application/json' },
                    template: { 'shortid': 'rkJTnK2ce' },
                    option: { preview: true },
                    data: {
                        "number": "69696969669",
                        "seller": {
                            "name": "Next Step Webs, Inc.",
                            "road": "12345 Sunny Road",
                            "country": "Sunnyville, TX 12345"
                        },
                        "buyer": {
                            "name": "Acme Corp.",
                            "road": "16 Johnson Road",
                            "country": "Paris, France 8060"
                        },
                        "items": [{
                            "name": "Website design",
                            "price": 300
                        }]
                    },
                }

                request.post({ url: 'http://localhost:5488/api/report', form: body })
                    .on('response', (res) => {
                            reply(res);
                    });



            } catch (error) {
                console.log(error)
                return Boom.badRequest();
            }
        }
    }
]