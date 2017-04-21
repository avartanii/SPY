require('dotenv').config();
var Hapi = require('hapi');
var Path = require('path');
var Inert = require('inert');
var Vision = require('vision');
var PostgreSQL = require('pg');
var PGConnectionString = require('pg-connection-string'); // uses npm url in its implementation

var setup = {
    host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
    port: (process.env.NODE_ENV === "test" ? process.env.TEST_PORT : process.env.PORT) || "8080"
};
var Api = require(Path.join(__dirname, 'routes/api_routes.js'));
var viewRoutes = require(Path.join(__dirname, 'routes/view_routes.js'));

var postgresqlPool = {
    register: function (server, options, next) {
        var dbconfig = PGConnectionString.parse(process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL);
        dbconfig.ssl = process.env.NODE_ENV === "production";
        dbconfig.max = 20;
        dbconfig.min = 4;

        var pool = new PostgreSQL.Pool(dbconfig);

        server.decorate('server', 'postgres', pool);
        server.decorate('request', 'postgres', pool);

        pool.on('error', function (err, client) {
            if ("" + err) {
                server.log(['warning', 'PostgreSQL'], "" + err);
                server.log(['warning', 'PostgreSQL'], client);
            }
        });

        next();
    }
};
postgresqlPool.register.attributes = {
    name: "PostgreSQL",
    version: "0.0.0"
};

var validate = require(Path.join(__dirname, 'api/validate.js'));

var SPY = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'static')
            }
        }
    }
});
SPY.connection({
    host: setup.host,
    port: setup.port
});

if (process.env.NODE_ENV !== "test") {
    SPY.register(require('hapi-auth-jwt2'), function (err) {

        if (err) {
            SPY.log(['error', 'hapi-auth-jwt2'], err);
        }
                    //    key    method     key refers to the method, basically renaming
        SPY.auth.strategy('jwt', 'jwt', {
            key: process.env.SPY_KEY,          // Never Share your secret key, passed in here for Hapi to use to decode jwt token when request comes in
            validateFunc: validate,            // validate function defined above
            verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
        });

        SPY.auth.default('jwt');

        // async - need to move these, postgres and the api routes below
        // are registered before the auth strategies above go through
        SPY.register(postgresqlPool, function () {});
        SPY.register(Api, { // calls the api_routes.js register method that is exported by the module
            routes: { // configuration option
                prefix: '/api'
            }
        }, function (error) {
          if (error) {
            console.error("Failed to load plugin:", error);
          }
        });

        /*
          Note that any routes added before server.auth.default() is called will not have the default applied to them.
          If you need to make sure that all routes have the default strategy applied,
          you must either call server.auth.default() before adding any of your routes,
          or set the default mode when registering the strategy.
        */

        // EXAMPLE ROUTES
        // SPY.route([
        //   {
        //     method: "GET", path: "/", config: { auth: false },
        //     handler: function(request, reply) {
        //       reply({text: 'Token not required'});
        //     }
        //   },
        //   {
        //     method: 'GET', path: '/restricted', config: { auth: 'jwt' },
        //     handler: function(request, reply) {
        //       reply({text: 'You used a Token!'})
        //       .header("Authorization", request.headers.authorization);
        //     }
        //   }
        // ]);
    });
} else {
  SPY.register(postgresqlPool, function () {}); // calls postgresqlPool's register function (defined above)
  SPY.register(Api, { // calls the api_routes.js register method that is exported by the module
      routes: { // configuration option
          prefix: '/api'
      }
  });
}

SPY.register(Inert, function () {});
SPY.register(Vision, function () {
    SPY.views({
        engines: {
            html: require('nunjucks-hapi')
        },
        path: Path.join(__dirname, 'templates')
    });
    SPY.route(viewRoutes);
});

SPY.register({
    register: require('good'),
    options: {
        ops: {
            interval: 1000
        },
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    log: '*',
                    response: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, function (err) {
    if (err) {
        SPY.log(['error', 'good'], err);
    }
});

SPY.start(function () {
    SPY.log(['info', 'SPY'], "Server started on " + setup.host + ":" + setup.port);
    SPY.log(['info', 'SPY'], (process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL));
});

module.exports = SPY;
