CREATE USER booking WITH PASSWORD 'yzPV225HeSWv';
CREATE DATABASE "booking-users" OWNER booking;
CREATE DATABASE "booking-properties" OWNER booking;
GRANT ALL PRIVILEGES ON DATABASE "booking-users" TO booking;
GRANT ALL PRIVILEGES ON DATABASE "booking-properties" TO booking;