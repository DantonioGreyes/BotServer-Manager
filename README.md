#BotServer Manager V2.0

###Description 
> This server controls all operations the bots, connexion with database, implementation of API RESTful and WebSocket for generate reports in real time.
### Services
```
POST: http://localhost:3000/botexecution/:botname
POST: sync-bot-information/:botname
POST: sync-bot-information/all
```
###Request for Database
```
POST:   create/:method/:collection/
GET:    read/:method/:collection/
PUT:    update/:method/:collection/
DELETE: delete/:method/:collection/ 
```
###Method
```
[one, many, all]
```
- **one:** *Set idElement or Object with a element*
- **many:** *Set a array of Object with elements*
- **all:** *Not require elements and returns all value of a collection*

###CREATE Example
> **Method  ONE**
``` 
    POST: create/one/botinformation
    SET: object;
    {
        botname  : "Optum"
        url      : "http:/bottest.webservice"
        login    : "username"
        password : "password" 
    }
    RETURN: _id Object()
```
> **Method  MANY**
``` 
    Use Method < MANY >  
    -----------------------------------------
    POST: create/many/botinformation
    SET: array of oject;
    [{
        botname  : "Optum"
        url      : "http:/bottest.webservice"
        login    : "username"
        password : "password" 
    },
    {
        botname  : "payspan"
        url      : "http:/bottest.webservice"
        login    : "username"
        password : "password" 
    }]
    RETURN: ?
```
> **Method  ALL**
``` 
     This NOT WORK with function "CREATE"
```

###READ Example
> **Method  ONE**
``` 
    GET: read/one/botinformation
    SET: < ObjQuery > {field : value}
    
    {botname  : "Optum"}
    
    RETURN: ObjResult
```