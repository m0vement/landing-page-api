function visited(request, reply) {
  reply({
    hello: request.params.name,
  });
}

function register(server, options, next) {
  server.route({
    method: 'GET',
    path: '/visited',
    handler: visited,
  });

  return next();
}

register.attributes = {
  name: 'api',
};

export default register;
