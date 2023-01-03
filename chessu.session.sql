SELECT * FROM "user";

INSERT INTO "user"(name, email, password) VALUES('astwangw', 'tests@gmail.com', 'passwordd') RETURNING id, name, email;

UPDATE "user" SET name = 'nizepogii' WHERE id = 1 RETURNING id, name, email;

DELETE FROM "user" WHERE id = 4 RETURNING id, name, email;

DROP TABLE "game";
DROP TABLE "user";

INSERT INTO "game"(white_id, black_id) VALUES(undefined, undefined) RETURNING *;