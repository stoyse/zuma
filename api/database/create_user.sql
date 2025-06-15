CREATE TABLE "users" (
    userid VARCHAR(64) PRIMARY KEY UNIQUE,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    organisation VARCHAR(255)
);