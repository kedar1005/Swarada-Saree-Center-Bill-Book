CREATE DATABASE digital_bill_book;

USE digital_bill_book;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    customerAddress TEXT NOT NULL,
    billDate DATE NOT NULL,
    billAmount DECIMAL(10, 2) NOT NULL,
    productPhoto VARCHAR(255)
);
ALTER TABLE orders ADD COLUMN customerPhone VARCHAR(15);
select* from orders;