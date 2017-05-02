var Path = require('path');
var Api = require(Path.join(__dirname, '../api/api.js'));
var Schema = require(Path.join(__dirname, '../api/schema.js'));
// Schema has Joi, which is used to check for valid or invalid inputs
var _ = require('lodash'); // lots of useful utility functions

/* ajax calls from frontend js files use the path properties
    Example:
    $.ajax({
        url: "api/clients",
        data: data,
        method: "POST",
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            console.log(data);
        }
    });
*/
// details of route format of method, path, handler
// can found in Hapi Routing documentation
var apiRoutes = [
    {
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) { // request and reply come from Hapi package
            reply({
                'hello': 'Welcome to the spy webapp!'
            }).code(200);
        }
    },
    {
        method: 'POST',
        path: '/clients',
        handler: Api.createClient
    },
    {
        method: 'GET',
        path: '/casemanagers',
        handler: Api.getAllCaseManagers // this goes to api/api.js
    },
    {
        method: 'GET',
        path: '/clients/{clientID}',
        handler: Api.getClient
    },
    {
        method: 'PUT',
        path: '/clients/{clientID}',
        handler: Api.editClient
    },
    {
        method: 'GET',
        path: '/clients',
        handler: Api.getClients
    },
    {
        method: 'POST',
        path: '/dropins',
        config: {
            validate: {
                payload: Schema.createDropIn
            }
        },
        handler: Api.createDropIn
    },
    {
        method: 'GET',
        path: '/dropins',
        handler: Api.getDropIns
    },
    {
        method: 'GET',
        path: '/dropins/{dropin}',
        handler: Api.getDropIn
    },
    {
        method: 'GET',
        path: '/dropins/{dropin}/activities',
        handler: Api.getDropinActivities
    },
    {
        method: 'POST',
        path: '/dropins/{dropin}/activities',
        config: {
            validate: {
                payload: Schema.addActivitiesToDropIn
            }
        },
        handler: Api.addActivitiesToDropIn
    },
    {
        method: 'DELETE',
        path: '/dropins/{dropinID}/activities',
        config: {
            validate: {
                payload: Schema.removeActivitiesFromDropin
            }
        },
        handler: Api.removeActivitiesFromDropin
    },
    {
        method: 'GET',
        path: '/dropins/{dropinID}/activities/{activityID}',
        handler: Api.getDropinActivity
    },
    {
        method: 'GET',
        path: '/dropins/{dropinID}/activities/{activityID}/enrollment',
        handler: Api.getDropinActivityEnrollment
    },
    {
        method: 'POST',
        path: '/dropins/{dropinID}/activities/{activityID}/enrollment',
        config: {
            validate: {
                payload: Schema.addEnrollmentToDropinActivity
            }
        },
        handler: Api.addEnrollmentToDropinActivity
    },
    {
        method: 'DELETE',
        path: '/dropins/{dropinID}/activities/{activityID}/enrollment',
        config: {
            validate: {
                payload: Schema.removeEnrollmentToDropinActivity
            }
        },
        handler: Api.removeEnrollmentToDropinActivity
    },
    {
        method: 'GET',
        path: '/dropins/{dropinID}/enrollment',
        handler: Api.getDropinEnrollment
    },
    {
        method: 'GET',
        path: '/enroll/{activityID}',
        handler: Api.getEnrollmentByActivity
    },
    {
        method: 'POST',
        path: '/enroll',
        handler: Api.enroll
    },
    {
        method: 'GET',
        path: '/dropins/{dropinID}/checkin',
        handler: Api.getCheckInForDropin
    },
    {
        method: 'POST',
        path: '/dropins/{dropinID}/checkin',
        config: {
            validate: {
                payload: Schema.addCheckinForDropin
            }
        },
        handler: Api.addCheckinForDropin
    },
    {
        method: 'DELETE',
        path: '/dropins/{dropinID}/checkin',
        config: {
            validate: {
                payload: Schema.removeCheckinForDropin
            }
        },
        handler: Api.removeCheckinForDropin
    },
    {
        method: 'POST',
        path: '/activities',
        handler: Api.createDropinActivities
    },
    {
        method: 'GET',
        path: '/activities',
        handler: Api.getAllActivities
    },
    {
        method: 'GET',
        path: '/activities/{activityID}',
        handler: Api.getActivity
    },
    {
        method: 'GET',
        path: '/search/clients',
        handler: Api.dataBrowserGetClients
    },
    {
        method: 'GET',
        path: '/search/clients/{data}',
        handler: Api.dataBrowserSearchClients
    },
    {
        method: 'POST',
        path: "/activity",
        handler: Api.createActivity
    },
    {
        method: 'POST',
        path: "/editactivity",
        handler: Api.editActivity
    },
    {
        method: 'POST',
        path: '/case_notes',
        handler: Api.createCaseNote
    },
    {
        method: 'GET',
        path: '/case_notes/{clientID}',
        handler: Api.getClientCaseNotes
    },
    {
        method: 'GET',
        path: '/case_notes/notes/{noteID}',
        handler: Api.getCaseNote
    },
    {
        method: 'PUT',
        path: '/case_notes/{caseNoteID}',
        handler: Api.editCaseNote
    },
    {
        method: 'GET',
        path: '/flags/types',
        handler: Api.getFlagTypes
    },
    {
        method: 'GET',
        path: '/flags',
        handler: Api.getFlags
    },
    {
        method: 'POST',
        path: '/flags/types',
        handler: Api.createFlagType
    },
    {
        method: 'PUT',
        path: '/flags/types/{flagtypeID}',
        handler: Api.editFlagType
    },
    {
        method: 'GET',
        path: '/clients/{clientID}/flags',
        handler: Api.getClientFlags
    },
    {
        method: 'POST',
        path: '/clients/{clientID}/flags',
        handler: Api.setClientFlag
    },
    {
        method: 'PUT',
        path: '/flags',
        handler: Api.editClientFlag
    },
    {
        method: 'DELETE',
        path: '/flags',
        handler: Api.removeClientFlag
    },
    // {
    //     method: 'GET',
    //     path: '/flags',
    //     handler: Api.getFlags
    // },
    // {
    //     method: 'POST',
    //     path: '/flags',
    //     handler: Api.createFlag
    // },
    // {
    //     method: 'PUT',
    //     path: '/flags/{flagID}',
    //     handler: Api.editFlag
    // },
    // {
    //     method: 'GET',
    //     path: '/flags/{clientID}',
    //     handler: Api.getClientFlags
    // },
    {
        method: 'GET',
        path: '/users',
        handler: Api.getUserList
    },
    {
        method: 'POST',
        path: '/users',
        config: {
            validate: {
                payload: Schema.newUser
            }
        },
        handler: Api.createUser
    },
    {
        method: 'GET',
        path: '/users/{userId}',
        // config: {
        //   auth: {
        //     scope: 'superadmin'
        //   }
        // },
        handler: Api.getUser
    },
    {
        method: 'PUT',
        path: '/users/{userId}',
        handler: Api.updateUser
    },
    {
        method: 'POST',
        path: '/sessions',
        config: {
            auth: false,
            validate: {
                payload: Schema.login
            }
        },
        handler: Api.login
    },
    {
        method: 'GET',
        path: '/users/{userId}/notifications',
        handler: Api.getUsersNotifications
    },
    {
        method: 'POST',
        path: '/users/{userId}/notifications',
        config: {
            validate: {
                payload: Schema.notification
            }
        },
        handler: Api.createNotification
    },
    {
        method: 'GET',
        path: '/users/{userId}/notifications/{noteId}',
        handler: Api.getUsersNotificationsById
    },
    {
        method: 'PUT',
        path: '/users/{userId}/notifications/{noteId}',
        config: {
            validate: {
                payload: Schema.updateNotification
            }
        },
        handler: Api.updateUsersNotification
    },
    {
        method: 'GET',
        path: '/notifications/types',
        handler: Api.getNotificationTypes
    },
    {
        method: 'GET',
        path: '/users/{userId}/settings',
        handler: Api.getUserSettings
    },
    {
        method: 'PUT',
        path: '/users/{userId}/password',
        config: {
            validate: {
                payload: Schema.changeCurrentUserPassword
            }
        },
        handler: Api.changeCurrentUserPassword
    },
    {
      method: 'POST',
      path: '/users/{userId}/roles',
      handler: Api.assignRoleToUser
    },
    {
      method: 'GET',
      path: '/users/{userId}/roles',
      handler: Api.getUserRoles
    },
    {
      method: 'POST',
      path: '/roles',
      handler: Api.createRole
    },
    {
      method: 'GET',
      path: '/roles',
      handler: Api.getAllRoles
    },
    {
        method: 'POST',
        path: '/clients/{clientID}/case_plan',
        handler: Api.createCasePlan
    },
    {
        method: 'GET',
        path: '/clients/{clientID}/case_plan',
        handler: Api.getCasePlan
    },
    {
        method: 'PUT',
        path: '/clients/{clientID}/case_plan',
        handler: Api.editCasePlan
    },
    {
        method: 'Delete',
        path: '/users/{userId}',
        handler: Api.deleteUser
    },
    {
        method: 'POST',
        path: '/files',
        config: {
            payload: {
                maxBytes: 209715200,
                //output: 'stream',
                //parse: false
            }
        },
        handler: Api.uploadFile
    },
    {
        method: 'GET',
        path: '/files/{clientID}',
        handler: Api.getClientFiles
    },
    {
        method: 'GET',
        path: '/files/profile_picture/{clientID}',
        handler: Api.getProfilePicture
    },
    {
        method: 'POST',
        path: '/files/delete/{fileID}',
        handler: Api.deleteFile
    },
    {
        method: 'GET',
        path: '/clients/{clientID}/forms',
        handler: Api.getClientForms
    },
    {
        method: 'GET',
        path: '/programs',
        handler: Api.getPrograms
    },
    {
        method: 'GET',
        path: '/followups',
        handler: Api.getAllFollowUps
    },
    {
        method: 'GET',
        path: '/followups/followup/{id}',
        handler: Api.getFollowUp
    },
    {
        method: 'GET',
        path: '/followups/{casemanagerID}',
        handler: Api.getCaseManagerFollowUps
    },
    {
        method: 'POST',
        path: '/followups/{id}',
        handler: Api.editFollowUp
    },
    {
        method: 'POST',
        path: '/followups',
        handler: Api.createFollowUp
    },
    {
        method: 'POST',
        path: '/followups/delete/{id}',
        handler: Api.deleteFollowUp
    },
    {
        method: 'POST',
        path: '/uploadSpreadsheet',
        handler: Api.uploadSpreadsheet
    }
];

// api in this case is a plugin run by the Hapi node package
// each plugin has a register method

/*
  the Hapi server will call this register function when it registers this module (which acts as middleware)
  SPY.register(Api, {
      routes: {
          prefix: '/api'
      }
  });
*/

module.exports.register = function (server, options, next) {
  if (process.env.NODE_ENV !== 'test') {
    // retrieve the roles_paths_verbs matches
    server.postgres.connect(function (error, client, release) {
        if (error) {
          release();
          return console.error(error);
        }
        var queryString = `SELECT roles.name AS role, paths.name AS path, verbs.name AS verb
                           FROM match_roles_paths_verbs m
                           JOIN roles
                           ON m.role_id = roles.id
                           JOIN paths
                           ON m.path_id = paths.id
                           JOIN verbs
                           ON m.verb_id = verbs.id;`;
        client.query(queryString, function (error, result) {
            if (error || !result.rows[0]) {
                release();
                return console.error(error);
            }
            release();
            var permissions = [];
            for (var i = 0; i < result.rows.length; i++) {
                var local = result.rows[i];
                permissions.push({
                    role: local.role,
                    path: local.path,
                    verb: local.verb
                });
            }

            // decorate the routes before sending them into server.route()

            // this is why we need to start splitting up the routes into different modules
            // this nested for loop could become time-consuming as the routes
            // and permissions grow
            permissions.forEach((p) => {
              let index = _.findIndex(apiRoutes, (r) => { return (r.path === p.path && r.method === p.verb); });
              if (index !== -1) {
                switch (apiRoutes[index]) {
                  case (((apiRoutes[index] || {}).config || {}).auth || {}).scope:
                    apiRoutes[index].config.auth.scope.push(p.role);
                    break;
                  case ((apiRoutes[index] || {}).config || {}).auth:
                    apiRoutes[index].config.auth.scope = [ p.role ];
                    break;
                  case (apiRoutes[index] || {}).config:
                    apiRoutes[index].config.auth = {
                      scope: [ p.role ]
                    };
                    break;
                  default:
                    apiRoutes[index].config = {
                      auth: {
                        scope: [ p.role ]
                      }
                    };
                }

                /*
                  roles -> scope
                  paths -> paths
                  verbs -> method
                */
              }
            });
            server.route(apiRoutes); // apply api routes to the server, the configuration options passed in are applied automatically
            next(); // method called when plugin has completed steps
        });
    });
  } else {
    server.route(apiRoutes); // apply api routes to the server, the configuration options passed in are applied automatically
    next(); // method called when plugin has completed steps
  }
};


module.exports.register.attributes = {
    name: "api",
    version: "0.0.0"
};
