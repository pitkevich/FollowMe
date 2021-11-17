# App

### To run dev server go to directory and run npm:

cd FollowMe/App/followme  
npm run dev

### To test API:

[user](http://localhost:3000/api/users/1)  
[lists](http://localhost:3000/api/lists/1)  
[list 1](http://localhost:3000/api/lists/1/1)

### To work with SQL:  

command line ubuntu:  

sudo apt-get update  
sudo apt-get install -y mariadb-server mariadb-client  

sudo mysql_secure_installation  
> set root password to 'x7vlgBtWF+'  

After run server and setup root sec,  
Create user and DB:  

sudo mysql -u root

```sql  
CREATE USER 'fadmin'@'%' IDENTIFIED BY '8FxLWcquHb';  
GRANT ALL PRIVILEGES ON *.* TO 'fadmin'@'%' WITH GRANT OPTION;  
FLUSH PRIVILEGES;  
CREATE DATABASE store;  
```

Create .env.local file for MySQL Database credentials

```typescript  
STORAGE=MYSQL
MYSQL_HOST=localhost  
MYSQL_DATABASE=store  
MYSQL_USERNAME=fadmin  
MYSQL_PASSWORD=8FxLWcquHb  
MYSQL_PORT=3306  
```  
 
if STORAGE!=MYSQL, mysql is not used 

Create table for lists and followers  
optional - DROP TABLE store.dlists;

```sql  
DROP TABLE store.dlists;
CREATE TABLE store.dlists ( 
	id                   bigint UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	`userKey`            varchar(48)  NOT NULL    ,
	`nodeKey`            varchar(36)  NOT NULL    ,
	name                 varchar(1024)  NOT NULL    ,
	`nodeType`           int UNSIGNED NOT NULL DEFAULT 0   ,
	data                 longtext      ,
	CONSTRAINT `dlists_UN` UNIQUE ( `nodeKey` ) 
 );

CREATE INDEX idx_dlists_user ON store.dlists ( `userKey` );


CREATE TABLE store.dfollowers ( 
	id                   bigint UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	`userKey`            varchar(48)  NOT NULL    ,
	`nodeKey`            varchar(36)  NOT NULL    ,
	`followerKey`        varchar(48)  NOT NULL    
 );

CREATE INDEX idx_dfollowers ON store.dfollowers ( `userKey`, `nodeKey` );
```  
