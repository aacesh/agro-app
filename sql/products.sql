create schema product;

/*
 Primary table for all Products.
 */
---------------------------------------------------
-----------------------TABLES------------------------
---------------------------------------------------
CREATE TABLE product.products (
    id serial PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image text,
    created_on TIMESTAMP NOT NULL
);

---------------------------------------------------
----------------------FUNCTIONS--------------------
---------------------------------------------------
/*
 Add a product.
 */
create
or replace function product.add_product(
    _name TEXT,
    _description TEXT,
    _price REAL,
    out _message text,
    out _id int
) as $$ 
declare 
	_currenttz timestamp:= current_timestamp;
begin
insert into
    product.products (name, description , price, created_on)
values
    (_name, _description , _price, _currenttz) returning id into _id;
_message:= '200::::success';
end;
$$ language plpgsql;




---------------------------------------------------
------------------DELETION/DROP--------------------
---------------------------------------------------

drop table product.products;



---------------------------------------------------
------------------QUERIES--------------------
---------------------------------------------------

select * from product.products p ;

ALTER TABLE product.products  
ADD COLUMN image text;