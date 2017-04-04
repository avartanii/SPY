#!/bin/bash

echo 'Deleting db & logs';
rm -rf db;
rm -rf log;
mkdir db;
mkdir log;
echo 'Initializing db';
initdb $(npm bin)/../../db;
pg_ctl -D $(npm bin)/../../db -l $(npm bin)/../../log/postgres.log start;
sleep 4;
psql -f $(npm bin)/../../config/create_spy_test.sql -d postgres; # need to create the new database from within the default postgres database that is initialized first
psql -f $(npm bin)/../../db_setup/db.sql -d spy_test;

# connect as spy_tester
# $ psql -d spy_test -U spy_tester
