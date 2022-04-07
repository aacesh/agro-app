create schema users;

/*
  Primary table for all users.
*/

---------------------------------------------------
-----------------------ENUM------------------------
---------------------------------------------------

CREATE TYPE user_role AS ENUM ('admin', 'user');


---------------------------------------------------
-----------------------TABLES------------------------
---------------------------------------------------


CREATE TABLE users.accounts (
	user_id serial PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    middle_name VARCHAR (20),
    last_name VARCHAR(20) NOT NULL,
	username VARCHAR ( 50 ) NOT NULL,
	password VARCHAR ( 50 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP ,
    role user_role
);




---------------------------------------------------
----------------------FUNCTIONS--------------------
---------------------------------------------------


/*
  Add an user.
*/
create or replace
function users.add_user(
   _first_name VARCHAR(20) ,
    _last_name VARCHAR(20) ,
	_username VARCHAR (50) ,
	_password VARCHAR (50) ,
	_email VARCHAR (255) ,
    _role user_role,
    _middle_name VARCHAR (20),
  out _message text,
  out _id int
)
as $$
declare 
  _currenttz timestamp := current_timestamp;
begin
  insert
	into
	users.accounts (
     first_name ,
	middle_name ,
	last_name ,
	username ,
	password ,
	email ,
	created_on ,
	last_login ,
	role 
  )
values (
   _first_name ,
    _middle_name ,
    _last_name ,
	_username ,
	_password ,
	_email ,
	_currenttz ,
    _currenttz ,
    _role 
  ) returning user_id
into
	_id;
_message := '200::::success';
end;
$$ language plpgsql;






