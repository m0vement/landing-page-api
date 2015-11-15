import {describe, it, beforeEach, afterEach} from 'mocha';
import createServer from '../src/server';
import chai from 'chai';
import rp from 'request-promise';

const expect = chai.expect;

describe('Signups', () => {
  let signupServer;
  const port = 8080;
  const url = 'http://localhost:' + port;

  beforeEach(() => {
    signupServer = createServer(port);
  });

  afterEach((done) => {
    signupServer.close(() => {
      done();
    });
  });

  describe('visited', () => {
    let response;
    const request = {
      method: 'POST',
      json: true,
      uri: url + '/messages',
      resolveWithFullResponse: true,
      body: {
        message: 'Cats are cute',
      },
    };

    beforeEach(() => {
      return rp(request)
        .then((resp) => {
          response = resp;
        });
    });

    it('should save the ip address and visit count of user', () => {
      expect(response.statusCode).to.equal(201);
      expect(response.body).to.be.an('object');
    });
  });
});
