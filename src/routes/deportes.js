const express = require('express')
const router = express.Router()
const {v4: uuidv4} = require('uuid');

const { readFile, writeFile } = require('../file');
const {models} = require('../libs/sequelize');

const File_Name = './db/deportes.txt';
const { DeporteModel } = require('../models'); // Asegúrate de importar tu modelo Sequelize

// Obtener todos los deportes
router.get('/deportes', async (req, res) => {
  try {
    const deportes = await DeporteModel.findAll();
    res.render('deportes/index', { deportes, search: req.query.search || '' });
  } catch (error) {
    console.error('Error al obtener deportes:', error);
    res.status(500).json({ error: 'Error al obtener deportes' });
  }
});

// Obtener un deporte por ID
router.get('/deportes/:id', async (req, res) => {
  const deporteId = req.params.id;
  try {
    const deporte = await DeporteModel.findByPk(deporteId);
    if (deporte) {
      res.render('deportes/show', { deporte });
    } else {
      res.status(404).json({ error: 'Deporte no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener deporte por ID:', error);
    res.status(500).json({ error: 'Error al obtener deporte por ID' });
  }
});

// Crear un nuevo deporte (formulario)
router.get('/deportes/create', (req, res) => {
  res.render('deportes/create');
});

// Procesar la creación del nuevo deporte
router.post('/deportes', async (req, res) => {
  const nuevoDeporte = req.body;
  try {
    const deporteCreado = await DeporteModel.create(nuevoDeporte);
    res.redirect('/deportes');
  } catch (error) {
    console.error('Error al crear deporte:', error);
    res.status(500).json({ error: 'Error al crear deporte' });
  }
});

// Actualizar un deporte por ID (formulario)
router.get('/deportes/:id/edit', async (req, res) => {
  const deporteId = req.params.id;
  try {
    const deporte = await DeporteModel.findByPk(deporteId);
    if (deporte) {
      res.render('deportes/edit', { deporte });
    } else {
      res.status(404).json({ error: 'Deporte no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener deporte por ID:', error);
    res.status(500).json({ error: 'Error al obtener deporte por ID' });
  }
});

//  actualización del deporte
router.put('/deportes/:id', async (req, res) => {
  const deporteId = req.params.id;
  const datosActualizados = req.body;
  try {
    const deporte = await DeporteModel.findByPk(deporteId);
    if (deporte) {
      await deporte.update(datosActualizados);
      res.redirect(`/deportes/${deporteId}`);
    } else {
      res.status(404).json({ error: 'Deporte no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar deporte por ID:', error);
    res.status(500).json({ error: 'Error al actualizar deporte por ID' });
  }
});

// Eliminar un deporte por ID
router.delete('/deportes/:id', async (req, res) => {
  const deporteId = req.params.id;
  try {
    const deporte = await DeporteModel.findByPk(deporteId);
    if (deporte) {
      await deporte.destroy();
      res.redirect('/deportes');
    } else {
      res.status(404).json({ error: 'Deporte no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar deporte por ID:', error);
    res.status(500).json({ error: 'Error al eliminar deporte por ID' });
  }
});

module.exports = router;



// //  //Modulos internas
// //  const { readFile, writeFile } = require('../files');
// //  const {models} = require('../libs/sequelize');

// //  const FILE_NAME = './db/deportes.txt';

// // //Rutas 
// // router.get('/', async (req, res) =>{
// // //     //let deportes = readFile(FILE_NAME);

// //      const {search} = req.query;
// //     if(search){
// //         deportes =deportes.filter(
// //             deporte => deporte.name.toLowerCase().includes(search.toLowerCase())
// //         );
// //     }
// // //consulta cruda
// //     ///const [deportes, metadata] = await sequelize.query('SELECT * FROM pets');
// //    // console.log('deportes:', deportes);
// //     //console.log('metadata:', metadata);
    
// //     //consulta con sequelize

//      let deportes = await models.Deporte.findAll();
//       console.log(deportes)
//       res.render('deportes/index', {deportes : deportes, search: search});

//  });

// //  router.get('/create', (req,res) =>{
// // //     //Mostrar el formulario
// //      res.render('deportes/create');
// //  })

//  router.post('/', async (req,res) =>{
//      try{
//         //Leer el archivo de deportes
//        // const data = readFile(FILE_NAME);
    
//         //Agregar nuevo depoprte
//         //const newPet = req.body;
//         //newPet.id = uuidv4();
//         //console.log(newDeporte)
//         //data.push(newDeporte); //agrego nuevo elemento
//         //Escribir en el archivo
//         //writeFile(FILE_NAME, data);
//         const newDeporte = await models.Deporte.create(req.body); 
//          res.redirect('/deportes')
//      }catch (error){
//             console.error(error);
//             res.json({message: ' Error al almacenar deporte'});
//          }
//  })
// //ya no es delete si no post
//  router.post('/:id', (req, res) =>{
//      console.log(req.params.id);
// //     //GUARDAR ID
//      const id = req.params.id
//     //leer contenido del archivo
//     //const deportes = readFile(FILE_NAME)

//     //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
//     //const deporteIndex = deportes.findIndex(deporte => deporte.id === id)
//     //if(deporteIndex < 0){
//       //  res.status(404).json({'ok': false, message:"Pet not found"})
//        // return;
//     //}
//     //eliminar la mascota en la posicion
//     //deportes.splice(deporteIndex,1);
//     //writeFile(FILE_NAME, deportes)
//      models.Deporte.destroy({
//          where:{
//              id: id
//          }
//    });
//      res.redirect('/deportes');
//  })


//   // modificar el crud para que haga lectura y escritura desde postgress

 

//  // Obtener todos los deportes
// router.get('/deportes', async (req, res) => {
//     try {
//       const deportes = await DeporteModel.findAll();
//       res.json(deportes);
//     } catch (error) {
//       console.error('Error al obtener deportes:', error);
//       res.status(500).json({ error: 'Error al obtener deportes' });
//     }
//   });
  
//   // Obtener un deporte por ID
//   router.get('/deportes/:id', async (req, res) => {
//     const deporteId = req.params.id;
//     try {
//       const deporte = await DeporteModel.findByPk(deporteId);
//       if (deporte) {
//         res.json(deporte);
//       } else {
//         res.status(404).json({ error: 'Deporte no encontrado' });
//       }
//     } catch (error) {
//       console.error('Error al obtener deporte por ID:', error);
//       res.status(500).json({ error: 'Error al obtener deporte por ID' });
//     }
//   });
  
//   // Crear un nuevo deporte
//   router.post('/deportes', async (req, res) => {
//     const nuevoDeporte = req.body;
//     try {
//       const deporteCreado = await DeporteModel.create(nuevoDeporte);
//       res.status(201).json(deporteCreado);
//     } catch (error) {
//       console.error('Error al crear deporte:', error);
//       res.status(500).json({ error: 'Error al crear deporte' });
//     }
//   });
  
//   // Actualizar un deporte por ID
//   router.put('/deportes/:id', async (req, res) => {
//     const deporteId = req.params.id;
//     const datosActualizados = req.body;
//     try {
//       const deporte = await DeporteModel.findByPk(deporteId);
//       if (deporte) {
//         await deporte.update(datosActualizados);
//         res.json(deporte);
//       } else {
//         res.status(404).json({ error: 'Deporte no encontrado' });
//       }
//     } catch (error) {
//       console.error('Error al actualizar deporte por ID:', error);
//       res.status(500).json({ error: 'Error al actualizar deporte por ID' });
//     }
//   });
  
//   // Eliminar un deporte por ID
//   router.delete('/deportes/:id', async (req, res) => {
//     const deporteId = req.params.id;
//     try {
//       const deporte = await DeporteModel.findByPk(deporteId);
//       if (deporte) {
//         await deporte.destroy();
//         res.json({ mensaje: 'Deporte eliminado exitosamente' });
//       } else {
//         res.status(404).json({ error: 'Deporte no encontrado' });
//       }
//     } catch (error) {
//       console.error('Error al eliminar deporte por ID:', error);
//       res.status(500).json({ error: 'Error al eliminar deporte por ID' });
//     }
//   });
  
  module.exports = router;