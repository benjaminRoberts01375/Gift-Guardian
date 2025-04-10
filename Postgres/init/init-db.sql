-- Create the gift_guardian database
CREATE DATABASE gift_guardian;

-- Connect to the gift_guardian database
\c gift_guardian

-- Setup DB
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    confirmed BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create a table for storing lists which hold groups of gifts
CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for storing groups
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    list_id INTEGER REFERENCES lists(id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for storing gifts
CREATE TABLE gifts (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    gotten BOOLEAN DEFAULT FALSE
);