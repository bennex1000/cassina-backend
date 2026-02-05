CREATE TABLE accessories (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  -- pullrate is int between 0 to 100
  pullrate DECIMAL NOT NULL,
  equipped BOOLEAN NOT NULL,
  theme_id INT NOT NULL,
  -- luck is int between -100 to 100 can be null
  passive_income int,
  luck DECIMAL,
  CONSTRAINT fk_theme
    FOREIGN KEY (theme_id)
      REFERENCES themes(id) ON DELETE CASCADE
);

CREATE TABLE themes (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

ALTER TABLE accessories ADD COLUMN equipped BOOLEAN NOT NULL;

INSERT INTO
  accessories ( name, pullrate, equipped, theme_id, passive_income, luck )
VALUES 
  ( 'faceware', 50, true, 1, 20, 1 ),
  ( 'faceware', 50, true, 2, 0, 1.5 );

INSERT INTO
  themes ( name )
VALUES 
  ( 'viking' ),
  ( 'samurai' );

DELETE FROM accessories WHERE id = 1;

UPDATE accessories
SET
  luck = 1.2
WHERE id = 1;

SELECT * FROM accessories;
