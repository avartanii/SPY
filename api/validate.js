module.exports = function (decoded, request, callback) {
    // console.log("Validate!!!!!=======");
    console.log(decoded); // contains decoded attributes of the token
    // when was it generated, when will it expire, who issued it,
    // and other parameters we signed it with in api/service.js
    // JWT.sign(session, process.env.SPY_KEY, jwtOptions, callback)
    // session is a custom object passed in to be encoded into the token
    // the encoding algorithm uses SPY_KEY to encode the object with the data
    console.log(request.route.fingerprint);
    // request.route.method for the method asked for
    // TODO: Look into what is in decoded & request
    // query the database for the user
    // query the role_assignments and match_roles_paths_verbs
    // (find a way to cache them if possible, but not in the server
    // because the server should remain stateless)
    // if there is a match, return true
    // else return 401 Unauthorized
    // return callback(null, true);
    return callback(null, true, { scope: ['superadmin', 'admin' ]}); // scope for current user
    // get the user's scope from the decoded token

    /*
      Routes will then get scopes attached to its auth configuration to match the user's scopes
      server.route({
        ...
        config: {
            auth: {
                strategy: 'simple',
                scope: ['user', 'admin']
            },
        }
        ...
      });
    */
};
