CREATE TABLE accessories (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  -- pullrate is int between 0 to 100
  pullrate DECIMAL NOT NULL,
  -- luck is int between -100 to 100 can be null
  luck DECIMAL
);

INSERT INTO
  accessories ( name, pullrate, luck )
VALUES 
  ( 'sunglasses', 50, 1.2 );

