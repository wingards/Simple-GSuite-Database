# Simple-GSuite-Database
A simple SAAS serverless database base on Google Apps Script(GAS)

## Authentication

Some of GAS instruction have to be authenticated. For this project, the following authentication are needed:
```
"https://www.googleapis.com/auth/script.external_request",
"https://www.googleapis.com/auth/userinfo.email",
"https://www.googleapis.com/auth/drive",
"https://www.googleapis.com/auth/spreadsheets"
```
Add these authentication to manifeast of the project make the program runs correctly.
