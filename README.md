# add by kumaran
# Radius-Django -----
# main file
Tunnelling
---
```sh
- Local
ssh -NT -o ServerAliveInterval=30 -o ExitOnForwardFailure=yes -f -L 33333:127.0.0.1:3306 root@125.62.213.150 -p 52220
VBCcentrtqskey9$$
- Radius dev new server
ssh -NT -o ServerAliveInterval=30 -o ExitOnForwardFailure=yes -f -L 55555:127.0.0.1:3306 sparkadmin@103.40.49.23 -p 22
Sp255_D2b_101$
- Production
ssh -NT -o ServerAliveInterval=30 -o ExitOnForwardFailure=yes -f -L 44444:127.0.0.1:3306 sparkadmin@123.108.200.141 -p 22
Sp255_D2b_101$
```

Connecting to database
---
```sh
mysql -u root -h 127.0.0.1 -P 33333 -p 
Mydb2p2ssSEC_p255

mysql -u root -h 127.0.0.1 -P 55555 -p 
Pn0d3_db_sqp2$s

mysql -u root -h 127.0.0.1 -P 44444 -p 
x
```

Celery commands
---
```sh
celery -A src worker -Q radius -n radiusnode -l INFO
celery -A src beat  -l INFO
celery -A project inspect ping
```

Notes
---
```yaml
- Customer disconnection
  1. if data complete but not due date
    - assign FUP package but do not delete user(radusergroup)
    - disconnect
  2. if due date completed
    - delete record in radcheck

- Customer connection
  - radcheck table(username,password)
  - radusergroup(username,planname)
- Plan insertion  
  - radgroupcheck(planname,datalimit)
  - radreplygroup(planname,up/down speeds)
  - customer connected NAS(IP)
  - nas table(IP)
```

django app ec2 cnctn using username & password
---
```sh
ssh ubuntu@ec2-13-126-58-181.ap-south-1.compute.amazonaws.com
root@123
```

To run websockets
---
```sh
cd Radius-Django/
export DJANGO_SETTINGS_MODULE='src.settings'
daphne -b 0.0.0.0 -p 5000 src.asgi:application
```

You must run django server using below cmd to serve static files in production (DEBUG=False)
```sh
./manage.py runserver --insecure 0:8000
```

Migrating database for error(Table radius.session_xxxxx doesn't exists)
---
```sh
./manage.py migrate --database default
``` 

Replace links at once
---
```sh
find src/components/*.js -type f -exec sed -i 's/ec2-3-108-41-115.ap-south-1.compute.amazonaws.com/125.62.213.150:8000/g' {} \;
```

Mysql dependencies in centos
---
```sh
yum install mysql-devel python36-devel
```

Improperly configured SQLite3 error
> Fix: You must install sqlite3 version above 3.8 and export path in `~/.bashrc` 

Installation
```sh
wget https://www.sqlite.org/2018/sqlite-autoconf-3xx0000.tar.gz
tar zxvf sqlite-autoconf-3xx0000.tar.gz
./configure --prefix=/usr/local
make
sudo make install
python3.6 -c "import sqlite3; print(sqlite3.sqlite_version)"
> 3.7.17
export LD_LIBRARY_PATH=/usr/local/lib
python3.6 -c "import sqlite3; print(sqlite3.sqlite_version)"
> 3.24.0
```
Must export this to `~/.bashrc` for permanent
```sh
export LD_LIBRARY_PATH=/usr/local/lib
```
Follow the link for more info
> https://stackoverflow.com/questions/55674176/django-cant-find-new-sqlite-version-sqlite-3-8-3-or-later-is-required-found

If files are not ignoring even configured in `.gitignore` file
```sh
git rm --cached -r .
```

Fixes:
