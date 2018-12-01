var express = require('express'); //Carga la librería express
var bodyparser = require("body-parser") /*Sirve para parsear los contenidos de las peticiones y que me
                                            traduzca los JSON*/
var DataStore = require("nedb")
var cors = require('cors');

var path = require("path");                     //Estas dos variables sirven para que cuando no se hagan llamadas a la API se redirija
const CONTACTS_APP_DIR = "/dist/contacts-app"   //a las páginas de angular


var port = (process.env.PORT || 3000);
var BASE_URL = "/api/v1";
var filename = __dirname +"/contacts.json" //__dirname = Directorio actual

var contacts = [
    {"name":"juan", "phone":5555} //contactos por defecto
];

var db = new DataStore({
    filename:filename,
    autoload:true
});


console.log("Starting API server..."); //Esto es para imprimir

var app = express(); /*Inicializar la librería express, esta variable es la que utilizaré 
                        para configurar mi servidor*/  
app.use(bodyparser.json());     
app.use(cors());          
app.use(express.static(path.join(__dirname,CONTACTS_APP_DIR))); //Utiliza la ruta dist/contacts-app por defecto
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,CONTACTS_APP_DIR,'/index.html'))
})
                        





   
                        
/* #############################################################################
 ##############################   GET        ###################################
################################################################################*/

app.get("/", (req, res) => { /*Cuando haga un get, va hacia el recurso "/", el segundo parámetro indica qué acción se hará
                                cuando se haga una petición. El res es lo que se devolverá. En definitiva, cuando
                                haga un get a /, se ejecutará el res.send */
    res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_URL+"/contacts", (req,res)=>{
    db.find({}, (err, contacts)=> {         /*Devuelve todo el contenido del fichero si no indico nada entre los {}*/
        if (err){
            console.error("Error accessing database");
            res.sendStatus(500);
        }else{
            res.send(contacts.map((contact)=> {
                delete contact._id;   //Eliminar el id
                return contact;
            })) /*, en caso de que no haya ocurrido error, devuelve contacts*/
        }
    });
});



//Obtener un contacto concreto
app.get(BASE_URL + "/contacts/:name", (req, res) => {
    // Get a single contact
    var name = req.params.name;
    console.log(Date()+" - GET /contacts/"+name);

    db.find({"name": name},(err,contacts)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(contacts.length>1){
                console.warn("Incosistent DB: duplicated name");
            }
            res.send(contacts.map((contact)=>{
                delete contact._id;
                return contact;
            })[0]);
        }
    });
});


/* #############################################################################
 ##############################  POST       ####################################
################################################################################*/

app.post(BASE_URL+ "/contacts", (req,res)=>{
    // Create a new contact
    console.log(Date()+" - POST /contacts");
    var contact = req.body;
    db.insert(contact);
    res.sendStatus(201);  
});

app.post(BASE_URL + "/contacts/:name", (req, res) => {
    // Forbidden
    console.log(Date()+" - POST /contacts");
    res.sendStatus(405);
});

/* #############################################################################
 ##############################  DELETE     ####################################
################################################################################*/
app.delete(BASE_URL + "/contacts", (req, res) => {
    // Remove all contacts
    console.log(Date()+" - DELETE /contacts");
    db.remove({});    
    res.sendStatus(200);
});


app.delete(BASE_URL + "/contacts/:name", (req, res) => {
    // Delete a single contact
    var name = req.params.name;
    console.log(Date()+" - DELETE /contacts/"+name);

    db.remove({"name": name},{},(err,numRemoved)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(numRemoved>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(numRemoved == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});


/* #############################################################################
 ##############################  PUT     ####################################
################################################################################*/
app.put(BASE_URL + "/contacts", (req, res) => {
    // Forbidden
    console.log(Date()+" - PUT /contacts");

    res.sendStatus(405);
});

app.put(BASE_URL + "/contacts/:name", (req, res) => {
    // Update contact
    var name = req.params.name;
    var updatedContact = req.body;
    console.log(Date()+" - PUT /contacts/"+name);

    if(name != updatedContact.name){
        res.sendStatus(409);
        return;
    }

    db.update({"name": name},updatedContact,(err,numUpdated)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(numUpdated>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(numUpdated == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});


app.listen(port); //Activa el servidor para que escuche en ese puerto

console.log("Server ready!");