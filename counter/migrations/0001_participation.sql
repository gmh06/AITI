CREATE TABLE participation_total (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total INTEGER NOT NULL CHECK (total >= 0)
);

INSERT INTO participation_total (id, total) VALUES (1, 0);

CREATE TABLE participation_events (
  id TEXT PRIMARY KEY NOT NULL
) WITHOUT ROWID;

-- Update the total in the same transaction, only for newly inserted IDs.
CREATE TRIGGER count_participation AFTER INSERT ON participation_events
BEGIN
  UPDATE participation_total SET total = total + 1 WHERE id = 1;
END;
