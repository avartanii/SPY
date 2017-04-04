#!/bin/bash

echo 'Deleting db & logs';
rm -rf db;
rm -rf log;
mkdir db;
mkdir log;
echo 'Initializing db';
initdb db;
pg_ctl -D db -l log/postgres.log start;
sleep 4;
psql -f ../config/create_spy_test.sql -d postgres; # need to create the new database from within the default postgres database that is initialized first
psql -f ../db_setup/db.sql -d spy_test;

# connect as spy_tester
# $ psql -d spy_test -U spy_tester
