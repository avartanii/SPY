![Safe Place for Youth Logo](resources/Logo.jpg "Safe Place for Youth Database Project")
[![Version][version-img]][version-url]
[![Build Status][build-img]][build-url]
[![Codecov][codecov-img]][codecov-url]
[![Dependency Status][dependency-img]][dependency-url]
[![Dev Dependency Status][dev-dependency-img]][dev-dependency-url]
[![nsp][nsp-img]][nsp-url]

[Read our Project Proposal](docs/Project_Proposal.md)

[Read our Requirements Specification](docs/Requirements_Specification.md)

[Read our Software Development Plan](docs/Software_Development_Plan.md)

[Read our Architecture Design](docs/Architecture_Design_Document.md)

[Read our Detailed Design Specification](docs/Detailed_Design_Specification.md)

Note: Commands shown below are run with bash in the terminal on Mac OS or git bash in the commandline on Windows
(Of course, also make sure you have the git commandline tools installed for either operating system.)

### Requirements
Install `npm` and `postgres` if you don't already have them installed
```
brew install node
brew install postgresql
```

### Installation
download and install packages
```
git clone https://github.com/cf7/SPY.git
cd SPY
npm install
```

### Config Files Required

**A shortcut to ensuring you have the correct config folder is to get the most recent config folder from a fellow team member on Slack.
The most recent config is from _May 17_.**

Note: brackets {} indicate values that should be filled in by the developer

#### Add a `config` _folder_ to the top-level of the SPY directory.

Have a SQL file `create_spy.sql` in the config folder that creates the database with the following lines of SQL.
```
CREATE USER {user} WITH PASSWORD '{password}';
CREATE DATABASE {dbname, default spy} OWNER {user};
ALTER USER {user} WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE '{dbname, default spy}' to '{user}';
```

Have another SQL file `create_spy_test.sql` in the config folder that creates the test database with the following lines of SQL.
```
CREATE USER {TEST_DB_USERNAME};
CREATE DATABASE {TEST_DB} OWNER '{TEST_DB_USERNAME}';
ALTER USER {TEST_DB_USERNAME} WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE '{TEST_DB}' to '{TEST_DB_USERNAME}';
```

Have a bash shell script file `set_test_env.sh` in the config folder that sets the test environment variables with the following lines.
```
#!/bin/bash

export TEST_DATABASE_URL=postgres://{TEST_DB_USERNAME}@localhost:{db_portnumber}/{TEST_DB}
export TEST_USERNAME=testusername   # different! login credentials for an actual user account in the app
export TEST_PASSWORD=secretpassword # different! login credentials for an actual user account in the app
export TEST_PORT={clientside_portnumber}
export TEST_DB_USERNAME={TEST_DB_USERNAME}
export TEST_DB={TEST_DB}
echo 'Environment Variables Set'
```

**Note: The environment variables in `set_test_env.sh` must be the same as their corresponding values in `create_spy_test.sh`.**

#### Add a `.env` _file_ to the top-level of the SPY directory.
(filename is `.env` exactly)

Within `.env` add the following lines with their appropriate values.
```
DATABASE_URL=postgres://{username}:{password}@localhost:{db_portnumber}/{dbname}
SPY_KEY={secret key}
NODE_ENV=development
PORT={clientside_portnumber}
```

### Using the PostgreSQL Database in Non-Windows Environments


Initialize PostgreSQL for spy
```
npm run db-init
```

Start Database
```
npm run db-start
```

Stop Database
```
npm run db-stop
```
Reset Database (stop, initialize, start)
```
npm run db-reset
```

### Using the PostgreSQL Database in Windows Environments

* Note before running, ensure that a process of "postgres.exe" is not running already.
  * This can be done by opening up TaskManager or typing tasklist in CMD or Git Bash.
  * If it is running, open up CMD or Git Bash with administrative privileges and enter,
    taskkill /IM postgres.exe /F
* After fresh installations of PostGreSQL ensure that it is not set to run automatically
  by opening Services and looking for an entry named something similar to "postgresql..."
   * If it is not set to "manual", right click it, click properties, then set start up
     type to "manual".

Initialize PostgreSQL for spy
```
npm run win-db-init
```

Start Database
```
npm run win-db-start
```

Stop Database
```
npm run win-db-stop
```
Reset Database (stop, initialize, start)
```
npm run win-db-reset
```

### Running & Development

Start server
```
npm start
```

Alternately, start server to auto restart when a file changes, _provided by [nodemon](https://github.com/remy/nodemon/)_
```
npm run nodemon
```

_Note that since_ `authorization` _now is partially functional, you will most likely have to login to try out the site._

Run Tests
```
npm test
npm run lint
```

To view a coverage report, run `npm test`, then `npm run report`, then open up `coverage/lcov-report/index.html` in a webbrowser

[version-img]: https://img.shields.io/badge/version-alpha%204-red.svg
[version-url]: https://github.com/cf7/SPY

[build-img]: https://travis-ci.org/cf7/SPY.svg?branch=master
[build-url]: https://travis-ci.org/cf7/SPY

[codecov-img]: https://codecov.io/gh/cf7/SPY/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/cf7/SPY

[dependency-img]: https://david-dm.org/cf7/SPY.svg
[dependency-url]: https://david-dm.org/cf7/SPY

[dev-dependency-img]: https://david-dm.org/cf7/SPY/dev-status.svg
[dev-dependency-url]: https://david-dm.org/cf7/SPY?type=dev

[nsp-img]: https://nodesecurity.io/orgs/spy-database-app/projects/a5e92551-7ea6-4500-bc8f-cedca8b8b409/badge
[nsp-url]: https://nodesecurity.io/orgs/spy-database-app/projects/a5e92551-7ea6-4500-bc8f-cedca8b8b409
