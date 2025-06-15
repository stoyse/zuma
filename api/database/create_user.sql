CREATE TABLE "users" (
    userid VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    organisation VARCHAR(255)
);