# CafePlugGuardian-Server

## CafePlugGuardian Project
### Introduction
CafePlugGuardian is a capstone design project at the Chung-Ang University's Department of Software Engineering.

Please note that we will not be accepting contributions for CafePlugGuardian, as it is a Capstone Design Project.

#### The Goal of CafePlugGuardian Project
1. The pin number allows only cafe customers to use the plug, preventing unauthorized use of the plug.
2. Limit the amount of electricity to restrict customers who use excessive power or stay for long periods of time.
3. By analyzing the current patterns of devices in use, devices not permitted in the cafe, such as smartphones and laptop chargers, are automatically blocked through machine learning.

### Structure of CafePlugGuardian
<img width="80%" src="https://github.com/CAU-Capstone-PPL/CafePlugGuardian-Server/assets/55429793/74940115-831a-49f7-ab9a-3d5dc402089a"/>

### Sub Projects of CafePlugGuardian
* [CafePlugGuardian-Client](https://github.com/CAU-Capstone-PPL/CafePlugGuardian-Client)
    * Cafe Manager App - flutter app
* [CafePlugGuardian-WebClient](https://github.com/CAU-Capstone-PPL/CafePlugGuardian-WebClient)
    * Cafe Customer Web - flutter web
* [CafePlugGuardian-Server](https://github.com/CAU-Capstone-PPL/CafePlugGuardian-Server)
    * Backend server - express.js
* [CafePlugGuardian-Hardware](https://github.com/CAU-Capstone-PPL/CafePlugGuardian-Hardware)
    * SmartPlug embedded system - arduino(tasmota open source)
* [CafePlugGuardian-ML](https://github.com/CAU-Capstone-PPL/CafePlugGuardian-ML)
    * AI model - pytorch, GRU model
* [CafePlugGuardian-ML_Server_Flask](https://github.com/CAU-Capstone-PPL/CafePlugGuardian-ML_Server_Flask)
    * AI server - flask

### Additional Requirements
* MongoDB
    * NoSQL DBMS
    * In our project, we install and use mongoDB on an ec2 instance.
    * Install and run mongoDB, or use a mongoDB server.
* MQTT Broker
    * In our project, we install and use mosquitto as an MQTT broker on an ec2 instance.
    * You can install another MQTT broker or use a separate broker server if you have one.

## CafePlugGuardian-Server
### Introduction
CafePlugGuardian-Server is a part of CafePlugGuardian project.

The goal of the CafePlugGuardian-Server project is to implement a backend server to act as an intermediary for the CafePlugGuardian project.
* **Web, App**: Receives http API requests and performs service logic.
* **Smart plug**: Except when the app directly accesses the plug's AP when connecting the plug for the first time, all communication with the plug is done using the MQTT protocol through an MQTT broker in the backend.
* **Artificial intelligence Server**: The current pattern is transmitted to a separate artificial intelligence server to check whether the device is allowed and process the logic accordingly.
* **Database**: This backend server is the only one in the CafePlugGuardian project that accesses the database and manages data.

### How to use CafePlugGuardian-Server
1. Prepare a computer to run the backend server
   * In our project, we ran it on Amazon Linux 2 on an ec2 instance of AWS (Amazon Web Service).
2. Install node.js in the environment
   * Version 16 of node was used.
   * It is highly likely that a lower version is possible, but it has not been verified.
   * Conversely, operation was confirmed in version 18.
3. Prepare mongoDB server
   * In our project, we installed and used mongoDB on the same ec2 instance as the backend server.
   * You can also use a server such as AWS's DocumentDB or Atlas' mongoDB Cloud.
4. Prepare the MQTT broker server
   * In our project, we installed and used an MQTT broker called mosquitto on the same ec2 instance as the backend server.
   * You can install an MQTT broker other than mosquitto, or use a server that provides an MQTT broker.
5. Clone or Fork CafePlugGuardian-Server
   * Download directly from the environment where you will run the server, or download it locally and set the environment before uploading it.
6. Set environment with .env file
   * Rename or copy the /src/config/private/.env-sample file to use.
   * You can change the name to whatever you want, but the name previously used in the project is as follows.
     * **.env.development.local**: Environment configuration file used when developing locally.
     * **.env.production.local**: Environment configuration file used during deployment.
     * **.env.test.local**: Configuration file used when using a different database by separating the test environment and development environment.
   * If you want to use any other name, do the following:
     1. Be careful not to expose sensitive information to GitHub by creating an .env file with the desired name and adding it to .gitignore.
     2. Modified conditional statements for environments added to /src/config/environment.ts.
     3. Add a command to execute the environment in the scripts of package.json or modify the existing script.
7. Install pm2 globally in the environment where the backend server will run
   * npm install -g pm2
   * pm2 is a non-stop service based on node.js. Unlike other dependency packages, pm2 must be installed globally, so install it using the above command in the terminal.
8. Install dependency packages with npm
   * Install dependency packages using the following command in the project directory in the environment where the server will run.

## License
This program is licensed under MIT
