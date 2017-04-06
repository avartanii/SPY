#!/bin/bash

echo 'Deleting db & logs';
rm -rf db;
rm -rf log;
mkdir db;
mkdir log;
echo 'Initializing db';
initdb $(npm bin)/../../db --username=spy_tester; # make sure username is same as config user that owns the database
pg_ctl -D $(npm bin)/../../db -l $(npm bin)/../../log/postgres.log start;
sleep 4;
psql -f $(npm bin)/../../config/create_spy_test.sql -d postgres --username=spy_tester; # need to create the new database from within the default postgres database that is initialized first
psql -f $(npm bin)/../../db_setup/db.sql -d spy_test --username=spy_tester;

# connect as spy_tester
# $ psql -d spy_test -U spy_tester


# if using initdb with username postgres
# then all other commands such as psql and pg_ctl
# must have the flag to designate --username=postgres
# otherwise, the other commands will still try to use the default username
