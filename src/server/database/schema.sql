DROP TABLE IF EXISTS channel_member;
DROP TABLE IF EXISTS thread;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS channel;
DROP TABLE IF EXISTS member;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS member (
	id UUID PRIMARY KEY default uuid_generate_v4(),
	name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS channel (
	id UUID PRIMARY KEY default uuid_generate_v4(),
	name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS channel_member (
	channel_id UUID references channel(id),
	member_id UUID references member(id)
);

CREATE TABLE IF NOT EXISTS message (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    content VARCHAR,
    sender_id UUID references member(id),
    dest_id UUID references message(id),
    timestamp TIMESTAMPTZ default now()
);

CREATE TABLE IF NOT EXISTS thread (
	id UUID PRIMARY KEY default uuid_generate_v4(),
	channel_id UUID references channel(id),
	root_id UUID references message(id)
);


-- Seed

INSERT INTO channel
	(name) 
VALUES
	('players'),
	('haters');
	

INSERT INTO member
	(name)
VALUES
	('mike'),
	('ralph'),
	('sara'),
	('celeste'),
	('tony');
	
INSERT INTO channel_member
	(channel_id, member_id)
VALUES
	((SELECT id FROM channel WHERE name = 'players'), (SELECT id FROM member WHERE name = 'mike')),
	((SELECT id FROM channel WHERE name = 'players'), (SELECT id FROM member WHERE name = 'ralph')),
	((SELECT id FROM channel WHERE name = 'players'), (SELECT id FROM member WHERE name = 'sara')),
	((SELECT id FROM channel WHERE name = 'haters'), (SELECT id FROM member WHERE name = 'celeste')),
	((SELECT id FROM channel WHERE name = 'haters'), (SELECT id FROM member WHERE name = 'tony'));


INSERT INTO message
	(sender_id, content)
VALUES
	((SELECT id FROM member WHERE name = 'mike'), 'Hello players');
	
INSERT INTO thread
	(channel_id, root_id)
VALUES
	((SELECT id FROM channel WHERE name = 'players'), (SELECT id FROM message WHERE content = 'Hello players'));
	
INSERT INTO message
	(sender_id, dest_id, content)
VALUES
	((SELECT id FROM member WHERE name = 'sara'), (SELECT id FROM message WHERE content = 'Hello players'), 'The usual');
	
INSERT INTO message
	(sender_id, dest_id, content)
VALUES
	((SELECT id FROM member WHERE name = 'ralph'), (SELECT id FROM message WHERE content = 'The usual'), 'That is off the hook');
	
INSERT INTO message
	(sender_id, dest_id, content)
VALUES
	((SELECT id FROM member WHERE name = 'mike'), (SELECT id FROM message WHERE content = 'The usual'), 'I love it!');

