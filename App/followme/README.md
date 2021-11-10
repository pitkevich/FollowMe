# App

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
