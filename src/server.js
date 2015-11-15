import express from 'express';
import bodyParser from 'body-parser';

export default function createServer(port) {
  const app = express();

  app.use(bodyParser.text({
    type: 'application/json',
  }));

  app.post('/messages', (req, res) => {
    const reqBody = JSON.parse(req.body);
    const body = {
      message: reqBody.message,
    };
    res.status(201).send(body);
  });

  app.get('/messages', (req, res) => {
    const body = {
      messages: 'ss',
    };
    res.status(200).send(body);
  });

  return app.listen(~~process.env.PORT || port);
}
