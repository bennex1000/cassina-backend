CREATE TABLE accessories (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  -- pullrate is int between 0 to 100
  pullrate DECIMAL NOT NULL,
  equipped BOOLEAN NOT NULL,
  -- luck is int between -100 to 100 can be null
  luck DECIMAL
);

ALTER TABLE accessories ADD COLUMN equipped BOOLEAN NOT NULL;

INSERT INTO
  accessories ( name, pullrate, equipped, luck )
VALUES 
  ( 'sunglasses', 50, true, 1.2 );

DELETE FROM accessories WHERE id = 1;

UPDATE accessories
SET
  luck = 1.2
WHERE id = 1;

SELECT * FROM accessories;
