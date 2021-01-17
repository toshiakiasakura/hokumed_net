# HOKUMED.NET, new version of hokui.net.
The site is now accessible via  http://hokumed.net   
The previous version of hokui.net is accessible via http://hokui.net   
The previous version of source codes are https://github.com/hokui/hokui.net  

# Backgroud. 
The previous version has some problems and it difficult to maintainance programs, so that  
our aim is to construct simple website.   Follow the rule of KISS!   


# Architecture 
- Frontend : React   
- Backend : Express   
- Database : sqlite  

Detail pacakges or tools are listed below.

## Frontend 
|  Pacakge or Tool |  Version  |  explanation  | 
| -----------------| ----------  | -----------------|
|  React  | v17.0.1 | Frontend Framework | 
| React-Router-Dom | v5.2.0 | Routing |
| Sass | | Styling. preprocessor for css | 

## Backend

|  Pacakge or Tool |  Version  |  explanation  | 
| -----------------| ----------  | -----------------|
| yarn | v1.22.10 | package manager | 
|  NodeJS  | v14.14.0 | Environment | 
| Express | v4.17.1 | Framework  | 
| Typescript | v4.1.3 | Language | 
| TypeORM | v0.2.29 | ORM, Object Relational Mapper | 
| Sqlite | v5.0.0 | database |  
| Nginx  | v1.19.0 |  For revese proxy to nodejs | 

## Other tools
| Tool name |  Explanation |
| -------------- | ------------ |
| create-react-app | v4.0.1 | Initial setting for react | 
| Selenium(python) | Testing Frame work |
| drawio | For Entity Relationship Diagram |

# Directory Structure 
Root directory(`/`) contains the backend application.  
Source codes under `client` directory work as a front end application. 

### Backend Directory Structure
The following files and directories are main ones which are needed to be edited.

| Files or Directories | Explanations | 
| -------------- | --------------- | 
| `/index.ts` | Entry point. |
| `/routes/*.ts` | Routing files. |
| `/api/*` | API functions. |
  
Others. 

| Files or Directories | Explanations | 
| -------------- | --------------- | 
| `/db/*` | `app.sqlite` is created when index.ts is run,  also it contains the migraition code written by python.  For the purpose of runing application, this python file can be ignored. |
| `/test/*` | Test codes for this web application written in python. You can ignore this file for just running the web application. |
| `/downloads/*` | Files to be downloaded. Uploaded files are saved to here. | 
| `/ormconfg.js` | typeORM config file.  |
| `/package.json` | npm/yarn package management file. In "scripts", shortcut command is written.|
| `/tsconfig.json` | typescript compile options. | 


### Frontend Directory Structure 
As noted, frontend codes are all summarized in `/client` directory. 
The following files and directories are main ones which are needed to be edited.

| Files or Directories | Explanations | 
| -------------- | --------------- | 
| `/client/src/index.ts` | Entry point. |
| `/client/src/App.ts` | Routing and Header setting. |
| `/client/src/components/*` | Each page code is written here. |
| `/client/src/style/*` | .sass, .scss files are contained. Adjust style here. | 
| `/client/src/entity/*` | Entities for frontend. Different structure from backend entities. |
| `/client/src/services/*` | Request functions are here, mainly use `axios` package. |
| `/client/public/*` |  index.html is for basic one. favicon.ico should be this name, can change the icon. |

Other files and directories are ones which you may not need to edit. 

# Command available for npm/yarn

### Both backend and frontend. 
- `yarn dev` : start both  frontend and backend application.   
- `yarn start` : start frontend or backend only.
- `yarn test` : Test using selenium. Run this command while running the both frontend and backend applications.  

### Backend only. 
- `yarn deploy` : Use in production environment. Recompile in backend and run the server with `forever`,    
rebuild the frontend codes.   

Note: Also type `yarn install` for backend **and** frontend directories if needed.

# Environmental Setting

### Nginx setting. 
Nginx is used for proxy the request to the web application.  
If you change the nginx setting, run  
```
nginx -t 
service nginx reload  
```

To change nginx setting, the administrator priviledges is needed. Contact me. 

### Environmental Variable Setting 
Set two environmental variable appropriately. 
- `HOKUI_SECRET` : secret key for jwt authentication. 
- `HOKUI_PW` : used in `/api/helpers/email.helper.ts`. Password for gmail. 

# Documents/Figures 
Sharing with dropbox.  Contact us if you want.
- ER diagram exists. 

# References
I summarize the links from which I learned when devloping this web application.  
https://akitoshiblogsite.com/react-express-typeorm-reference-links/

