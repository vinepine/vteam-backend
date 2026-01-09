SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS rentals;
DROP TABLE IF EXISTS scooters;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS price;
DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    balance FLOAT DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS city (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    zone TEXT
);

CREATE TABLE IF NOT EXISTS stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    name VARCHAR(100),
    capacity INT,
    lat TEXT NOT NULL,
    lon TEXT NOT NULL,
    radius INT,
    FOREIGN KEY (city_id) REFERENCES city(city_id)
);

CREATE TABLE IF NOT EXISTS scooters (
    scooter_id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    rented BOOLEAN DEFAULT FALSE,
    battery INT DEFAULT 100,
    lat TEXT NOT NULL,
    lon TEXT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city(city_id)
);

CREATE TABLE IF NOT EXISTS rentals (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scooter_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (scooter_id) REFERENCES scooters(scooter_id)
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    user_id INT NOT NULL,
    pay_method VARCHAR(50),
    amount FLOAT NOT NULL,
    status VARCHAR(50),
    FOREIGN KEY (rental_id) REFERENCES rentals(rental_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS price (
    id INT PRIMARY KEY,
    ppm FLOAT NOT NULL
)
