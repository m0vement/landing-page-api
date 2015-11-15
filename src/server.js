import express from 'express';
import bodyParser from 'body-parser';
import Signup from './signup';

export default function createServer(port) {
  const app = express();

  app.use(bodyParser.text({
    type: 'application/json',
  }));

  app.get('/visited', (req, res) => {
    let signup = new Signup({
      currentApp: req.query.currentApp,
      version: req.query.version,
      identifier: req.query.identifier,
      ipAddress: req.query.ipAddress,
      createdAt: new Date(),
    });

    Signup.findOne({ ipAddress: req.query.ipAddress }, (err, existingSignup) => {
      if (existingSignup) {
        signup = existingSignup;
      }

      signup.visitCount = signup.visitCount + 1;
      signup.save((err1, signupResponse) => {
        res.status(200).send({signup: signupResponse});
      });
    });
  });

  app.post('/signup', (req, res) => {
    const reqBody = JSON.parse(req.body);
    Signup.findOne({ ipAddress: reqBody.ipAddress }, (err, existingSignup) => {
      if (existingSignup) {
        existingSignup.data = reqBody.data;
        existingSignup.save((err1, signupResponse) => {
          res.status(200).send({signup: signupResponse});
        });
      } else {
        res.status(200).send({});
      }
    });
  });

  app.post('/clear', (req, res) => {
    const reqBody = JSON.parse(req.body);
    Signup.remove({ ipAddress: reqBody.ipAddress }, () => {
      res.status(200).send({});
    });
  });

  app.get('/signups/:current_app', (req, res) => {
    Signup.find({ currentApp: req.params.current_app }, (err, signups) => {
      res.status(200).send({signups: signups});
    });
  });

  return app.listen(port);
}
