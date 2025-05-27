CREATE USER booking WITH PASSWORD 'yzPV225HeSWv';

CREATE DATABASE "booking-users"
    WITH 
    OWNER = booking
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

\connect "booking-users"

CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
