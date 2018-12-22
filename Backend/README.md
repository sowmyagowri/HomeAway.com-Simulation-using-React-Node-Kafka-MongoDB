# HomeAway - Backend

How to run HomeAway backend?
  - Navigate to backend directory in cmd
  - Install required dependencies using npm install
  - Import the DB structures and data from the file SQLDBDump.sql
  - Run HomeAway back end using npm start
  - Test API calls with Mocha using npm test

How can I change port, if 3001 port is occupied?
  - Open settings.js file in the config folder in the backend directory
  - Change '3001' to currently available port number in line 10 ('backend_port': '3001')
