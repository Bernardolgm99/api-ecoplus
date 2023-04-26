# api-ecoplus
API created to provid all data to ecoplus's website.

## What do you need to install first?
+ git
+ Node.js
+ npm

## How to configure
First, you gonna need to clone our repository.
```
git clone https://github.com/Bernardolgm99/api-ecoplus.git
```
After this, you'll need to install depencencies from **package.json**.
This is really simple, just need to go the directory where the **package.json** is located and install the dependencies using the following command:
```
npm install
```
Now is almost done.
Create a file **.env** and fill it with the following environment:
```
NODE_ENV = 'development'
# Server configuration
PORT = 3000
HOST = '127.0.0.1'
# Database connection information
DB_HOST: ''
DB_USER: ''
DB_PASSWORD: ''
DB_NAME: ''
```
Complete the empty spaces with your database credentials.
**It's done to use**.
