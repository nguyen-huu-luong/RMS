# RMS
Software project

## Intro
Hi all, this is the guideline for coding on the production env

### Code workflow
local branch -> dev branch -> production branch <br />
- In particular, firstly, you code and debug on your branch an then you merge your branch to <b>dev</b> branch and <b>RMS/production</b> branch
- Secondly, you come the virtual machine and <b>change your role to root by this command:</b> <code>sudo su -</code>
- Thirdly, you go to source code by command <code>cd /home/RMS</code> and pull latest code in production branch by command <code>git pull origin</code>
- Finally, you restart the container which you updated code bu command <code>docker restart [container name]</code>. If you would like to change .env file, using this commanf <code>vim pathname/.env</code>
<br />
<b>Important</b>: You should restart the container, not rebuild image

### Backend server
- VM name: rms-system-1
- Host: 34.124.223.213

#### Database Postgres:
- PORT: 5432
- Container name: rms-db_postgres-1
#### Database Postgres UI
- PORT: 8000
- Container name: rms-adminer-1
#### Database Redis
- PORT: 6379
- Container name: rms-redis-1

#### Nodejs server:
- PORT: 3003
- Container name: rms-backend_internal-1
#### Flask server
- PORT: 8080
- Container name: rms-backend_external-1

### Admin server
- VM name: rms-system-admin
- Host: 35.240.185.145
- Port: 3000
- Container name: rms-frontend_admin-1

### User server
- VM name: rms-system-user
- Host: 34.126.118.102
- Port: 3001
- Container name: rms-frontend_user-1
