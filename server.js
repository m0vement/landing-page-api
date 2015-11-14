import Hapi from 'hapi';
import Good from 'good';
import Datastore from 'nedb';

const server = new Hapi.Server();
const signupsDb = new Datastore({ filename: 'signups1.db', autoload: true });

server.connection({port: ~~process.env.PORT || 3000});

server.route({
  method: 'GET',
  path: '/',
  handler(request, reply) {
    signupsDb.find({}, (err, docs) => {
      if (!err) {
        reply(`Hello, ${docs[0].tag}!`);
      }
    });
  },
});

server.route({
  method: 'GET',
  path: '/{name}',
  handler(request, reply) {
    signupsDb.insert({tag: request.params.name}, () => {
      reply('Hello, world!');
    });
  },
});

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*',
      },
    }],
  },
}, (err) => {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start(() => {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
