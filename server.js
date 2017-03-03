var Hapi = require('hapi');
var Path = require('path');
var Inert = require('inert');
var Vision = require('vision');
var PostgreSQL = require('pg');
var url = require('url');

var setup = {
    host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
    port: process.env.PORT || "8080"
};
var Api = require(Path.join(__dirname, 'routes/api_routes.js'));
var viewRoutes = require(Path.join(__dirname, 'routes/view_routes.js'));

var postgresqlPool = {
    register: function (server, options, next) {
        var params = url.parse(process.env.DATABASE_URL);
        var auth = params.auth.split(':');

        var dbconfig = {
            user: auth[0],
            password: auth[1],
            host: params.hostname,
            port: params.port,
            database: params.pathname.split('/')[1],
            ssl: process.env.NODE_ENV === "production",
            max: 20,
            min: 4
        };

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

var validate = function (decoded, request, callback) {
    console.log(decoded);
    // console.log(request);
    // TODO: Look into what is in decoded & request
    // query the database for the user
    return callback(null, true);
};

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

SPY.register(require('hapi-auth-jwt2'), function (err) {
 
    if (err) {
        SPY.log(['error', 'hapi-auth-jwt2'], err);
    }

    SPY.auth.strategy('jwt', 'jwt', {
        key: process.env.SPY_KEY,          // Never Share your secret key 
        validateFunc: validate,            // validate function defined above 
        verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm 
    });
 
    SPY.auth.default('jwt');
 
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

SPY.register(postgresqlPool, function () {});
SPY.register(Api, {
    routes: {
        prefix: '/api'
    }
});

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
    SPY.log(['info', 'SPY'], process.env.DATABASE_URL);
});

module.exports = SPY;
