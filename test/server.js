import {describe, it, beforeEach, afterEach} from 'mocha';
import Mongoose from 'mongoose';
import createServer from '../src/server';
import Signup from '../src/signup';
import chai from 'chai';
import rp from 'request-promise';

const expect = chai.expect;

describe('Signups', () => {
  let signupServer;
  let database;
  const port = 8080;
  const url = 'http://localhost:' + port;

  beforeEach((done) => {
    database = Mongoose.connect('mongodb://' + 'localhost/signups', () => {
      Signup.collection.remove();
      signupServer = createServer(port);
      done();
    });
  });

  afterEach((done) => {
    signupServer.close(() => {
      database.disconnect();
      done();
    });
  });

  describe('visited', () => {
    let response;
    const request = {
      method: 'GET',
      json: true,
      uri: url + '/visited?currentApp=current-app&version=1&identifier=test&ipAddress=192.168.0.1',
      resolveWithFullResponse: true,
    };

    beforeEach(() => {
      return rp(request)
        .then((resp) => {
          response = resp;
        });
    });

    it('should save the ip address and visit count of user', (done) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body.signup.visitCount).to.equal(1);
      rp(request)
        .then((resp) => {
          expect(resp.body.signup.visitCount).to.equal(2);
          done();
        });
    });

    it('should save data for the signup', (done) => {
      expect(response.body.signup.data).to.equal(undefined);
      rp({
        method: 'POST',
        json: true,
        uri: url + '/signup',
        resolveWithFullResponse: true,
        body: {
          ipAddress: '192.168.0.1',
          data: 'some-data',
        },
      }).then((resp) => {
        expect(resp.body.signup.data).to.equal('some-data');
        done();
      });
    });

    it('should clear all the signups', (done) => {
      rp({
        method: 'POST',
        json: true,
        uri: url + '/clear',
        resolveWithFullResponse: true,
        body: {
          ipAddress: '192.168.0.1',
        },
      }).then(() => {
        Signup.find({}, (err, docs) => {
          expect(docs.length).to.equal(0);
          done();
        });
      });
    });

    it('should return all signups for current app', (done) => {
      rp({
        method: 'GET',
        json: true,
        uri: url + '/signups/current-app',
        resolveWithFullResponse: true,
      })
        .then((resp) => {
          expect(resp.body.signups.length).to.equal(1);
          done();
        });
    });
  });
});
