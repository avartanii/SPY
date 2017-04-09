#!/bin/bash

echo 'Setting Environment Variables'
if [ -f set_test_env.sh ]; then chmod 700 set_test_env.sh; source set_test_env.sh; else echo "No set_test_env.sh file"; fi;
echo 'Deleting db & logs';
rm -rf db;
rm -rf log;
mkdir db;
mkdir log;
echo 'Initializing db';
initdb -U $TEST_DB_USERNAME -D db; # make sure username is same as config user that owns the database
pg_ctl -D db -l log/postgres.log start;
sleep 4;
echo $TEST_DB_USERNAME;
echo $TEST_DB;
createdb $TEST_DB -O $TEST_DB_USERNAME -U $TEST_DB_USERNAME; # bash does not parse --username=$TEST_DB_USERNAME correctly without the space
# psql -f config/create_spy_test.sql -d postgres --username=$TEST_DB_USERNAME; # need to create the new database from within the default postgres database that is initialized first
psql -f db_setup/db.sql -d $TEST_DB -U $TEST_DB_USERNAME;
echo 'Test Database initialized and started';
# connect to db $TEST_DB as user $TEST_DB_USERNAME
# $ psql -d $TEST_DB -U $TEST_DB_USERNAME


# if using initdb with username postgres
# then all other commands such as psql and pg_ctl
# must have the flag to designate --username=postgres
# otherwise, the other commands will still try to use the default os username
