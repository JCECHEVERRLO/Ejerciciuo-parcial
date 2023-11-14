const express = require('express')
const router = express.Router()
const {v4: uuidv4} = require('uuid');

 //Modulos internas
 const { readFile, writeFile } = require('../files');

 const FILE_NAME = './db/deportes.txt';

//Rutas de la API

//API
//Listar 
router.get('/', (req,res) =>{
    const deportes = readFile(FILE_NAME);
    const {search} = req.query;
    if(search){
        deportes =deportes.filter(deporte => deporte.name.toLowerCase().includes(search.toLocaleLowerCase()));
    }

    res.json(deportes);
})


//Crear 
router.post('/', (req, res) => {
    try{
    //Leer el archivo
    const data = readFile(FILE_NAME);

    //Agregar 
    const newDeporte = req.body;
    newDeporte.id = uuidv4();
    console.log(newDeporte)
    data.push(newDeporte); //agrego nuevo elemento
    //Escribir en el archivo
    writeFile(FILE_NAME, data);
    res.json({message: 'deporte fue creada'});
    }catch (error){
        console.error(error);
        res.json({message: ' Error al almacenar  deporte'});
    }

});

//Obtener una solo deporte  (usamos los dos puntos por que es un path param)
router.get('/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const deporteFound = deportes.find(deporte => deporte.id === id)
    if(!deporteFound){
        res.status(404).json({'ok': false, message:"Deporte not found"})
        return;
    }

    res.json({'ok': true, deporte: deporteFound});
})
//ACTUALIZAR UN DATO
router.put('/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const deporteIndex = deportes.findIndex(deporte => deporte.id === id)
    if(deporteIndex < 0){
        res.status(404).json({'ok': false, message:"Deporte not found"})
        return;
    }
    let deporte = [deporteIndex]; //sacar del arreglo
    deporte={...deporte, ...req.body}
    deportes[deporteIndex] = deporte //Poner deporte en el mismo lugar
    writeFile(FILE_NAME, deportes);
    //SI    DEPORTE EXISTE MODIFICAR LOS DATOS Y ALMACENAR NUEVAMENTE


    res.json({'ok': true, deporte: deporte});
})

//Delete, eliminar un dato
router.delete('/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    //BUSCAR DEPORTE CON EL ID QUE RECIBE
    const deporteIndex = deportes.findIndex(deporte => deporte.id === id)
    if(deporteIndex < 0){
        res.status(404).json({'ok': false, message:"Deporte not found"})
        return;
    }
    //eliminar deporte en la posicion
    deportes.splice(deporteIndex,1);
    writeFile(FILE_NAME, deportes)
    res.json({'ok': true});
})

module.exports = router;