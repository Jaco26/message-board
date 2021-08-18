DROP TABLE IF EXISTS message_reply;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS channel_thread;
DROP TABLE IF EXISTS channel_member;
DROP TABLE IF EXISTS channel;
DROP TABLE IF EXISTS thread;
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

CREATE TABLE IF NOT EXISTS message_reply (
	channel_id UUID references channel(id),
	message_id UUID references message(id),
);

CREATE TABLE IF NOT EXISTS thread (
	id UUID PRIMARY KEY default uuid_generate_v4(),
	channel_id UUID references channel(id),
	root_id UUID references message(id)
);

CREATE TABLE IF NOT EXISTS channel_thread (
	channel_id UUID references channel(id),
	thread_id UUID references thread(id),
);






