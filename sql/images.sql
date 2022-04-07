create schema file;

/*
 Primary table for all files.
 */
---------------------------------------------------
-----------------------TABLES------------------------
---------------------------------------------------
CREATE TABLE file.images (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL ,
    created_on TIMESTAMP NOT NULL
);

---------------------------------------------------
----------------------FUNCTIONS--------------------
---------------------------------------------------
/*
 Add an image.
 */
create
or replace function file.add_image(
    _id TEXT,
    _name TEXT,
    out _message text
) as $$ 
declare 
	_currenttz timestamp:= current_timestamp;
begin
insert into
    file.images (id, name , created_on)
values
    (_id, _name , _currenttz) ;
_message:= '200::::success';
end;
$$ language plpgsql;




---------------------------------------------------
------------------DELETION/DROP--------------------
---------------------------------------------------

drop table file.images;



---------------------------------------------------
------------------QUERIES--------------------
---------------------------------------------------

select * from file.images  ;

ALTER TABLE file.images  
ADD COLUMN product_id id;