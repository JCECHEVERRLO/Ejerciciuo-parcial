//Librerias externas
const express = require('express');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

const pdfMake = require('pdfmake');




// Define tus 
 //Modulos internas
 const { readFile, writeFile } = require('./src/files');

 const app = express();
 const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
 const FILE_NAME = './db/deportes.txt';

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', './src/views');
app.set('view engine', 'ejs') //DEBEMOS CREAR LA CARPETA

//Rutas
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    const students_list = ['Juan', 'Pablo', 'Lucas']
    //res.send(`Hello ${formal ? 'Mr.' : ''} 
    //${name} ${type ? ' ' + type : ''}`);
    res.render('index',{
        name : name,
        deportes : deportes_list,
    })

});

app.get('/read-file', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.send(data);
})

// punto uno filtrar 

app.get('/api/deportes', (req, res) => {
    const data = readFile(FILE_NAME);
    const idToFilter = req.query.id; // Obtener el valor del parámetro de consulta "id"

    if (idToFilter) {
        // Si se proporciona un ID, filtrar los registros por ese ID
        const filteredDeportes = data.filter(deporte => deporte.id === idToFilter);
        res.json(filteredDeportes);
    } else {
        // Si no se proporciona un ID, enviar todos los registros sin filtrar
        res.json(data);
    }
});
//WEB LISTAR Md
app.get('/deportes', (req, res) =>{
    const data = readFile(FILE_NAME);
    res.render('deportes/index', {deportes : data});
})

app.get('/deportes/create', (req,res) =>{


    
    //Mostrar el formulario
    res.render('deportes/create');
})

app.post('/deportes', (req,res) =>{
    try{
        //Leer el archivo de 
        const data = readFile(FILE_NAME);
    
        //Agregar nuevo
        const newDeporte = req.body;
        newDeporte.id = uuidv4();
        console.log(newDeporte)
        data.push(newDeporte); //agrego nuevo elemento
        //Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.redirect('/deportes')
    }catch (error){
            console.error(error);
            res.json({message: ' Error al almacenar '});
        }
})

app.delete('/deportes/delete/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const deporteIndex = deportes.findIndex(deporte => deporte.id === id)
    if(deporteIndex < 0){
        res.status(404).json({'ok': false, message:"deporte not found"})
        return;
    }
    //eliminar la mascota en la posicion
    deportes.splice(deporteIndex,1);
    writeFile(FILE_NAME, deportes)
    res.redirect({'/deportes': true});
})
//API
//Listar Mascotas
app.get('/api/deportes', (req,res) =>{
    const data = readFile(FILE_NAME);
    res.json(data);
})


//Crear 
app.post('/api/deportes', (req, res) => {
    try{
    //Leer el archivo de mascotas
    const data = readFile(FILE_NAME);

    //Agregar la nueva mascota
    const newDeporte = req.body;
    newDeporte.id = uuidv4();
    console.log(newDeporte)
    data.push(newDeporte); //agrego nuevo elemento
    //Escribir en el archivo
    writeFile(FILE_NAME, data);
    res.json({message: 'EL DEPORTE FUE CREADO'});
    }catch (error){
        console.error(error);
        res.json({message: ' Error al almacenar '});
    }

});

//Obtener una sola mascota (usamos los dos puntos por que es un path param)
app.get('/api/deportes/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const deporteFound = deportes.find(deporte => deporte.id === id)
    if(!deporteFound){
        res.status(404).json({'ok': false, message:"deporte not found"})
        return;
    }

    res.json({'ok': true, deporte: deporteFound});
})
//ACTUALIZAR UN DATO
app.put('/api/deportes/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const deporteIndex = deportes.findIndex(deporte => deporte.id === id)
    if(deporteIndex < 0){
        res.status(404).json({'ok': false, message:"deporte not found"})
        return;
    }
    let deporte = deportes[deporteIndex]; //sacar del arreglo
    deporte={...deporte, ...req.body}
    deportes[deporteIndex] = deporte //Poner deporte en el mismo lugar
    writeFile(FILE_NAME, deportes);
    //SI LA MASCOTA EXISTE MODIFICAR LOS DATOS Y ALMACENAR NUEVAMENTE


    res.json({'ok': true, deporte: deporte});
})

//Delete, eliminar un dato
app.delete('/api/deportes/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const pets = readFile(FILE_NAME)

    // CON EL ID QUE RECIBE
    const deporteIndex = deportes.findIndex(deporte => deporte.id === id)
    if(deporteIndex < 0){
        res.status(404).json({'ok': false, message:"deporte not found"})
        return;
    }
    //eliminar la mascota en la posicion
    deportes.splice(deporteIndex,1);
    writeFile(FILE_NAME, pets)
    res.json({'ok': true});
})



app.listen(3000, () => {
    console.log(`${APP_NAME} está corriendo en http://localhost:${PORT}`);
});