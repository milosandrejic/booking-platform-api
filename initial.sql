-- we need to run these queries manualy, first create booking user for all ports
-- then create database
-- add extenstions
-- you are ready

CREATE USER booking WITH
  LOGIN
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  INHERIT
  NOREPLICATION
  CONNECTION LIMIT -1
  PASSWORD 'yzPV225HeSWv';

CREATE DATABASE "booking-users"
    WITH 
    OWNER = booking
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

CREATE DATABASE "booking-property"
  WITH 
  OWNER = booking
  ENCODING = 'UTF8'
  CONNECTION LIMIT = -1;

  CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
  CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;