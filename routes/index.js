var express = require('express');
var multer = require('multer');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');
var statisticsController = require('../controllers/statistics_controller');
var favController = require('../controllers/favourites_controller');

// Página de entrada (home page)
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

router.get('/statistics', quizController.statistics);

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId
router.param('commentId', commentController.load); //autoload :commentId
router.param('userId', userController.load); //autoload :userId

// Definición de rutas de sesion
  router.get('/login', sessionController.new); // formulario login
  router.post('/login', sessionController.create); // crear sesión
  router.get('/logout', sessionController.destroy); // destruir sesión
 
// Definición de rutas de cuenta
  router.get('/user', userController.new);
  router.post('/user', userController.create);
  router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired, userController.ownershipRequired, userController.edit);
  router.put('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.update);
  router.delete('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
  router.get('/user/:userId(\\d+)/quizes', sessionController.loginRequired, userController.ownershipRequired, quizController.index);

// Definición de rutas de /quizes
  router.get('/quizes', sessionController.timeout, quizController.index);
  router.get('/quizes/:quizId(\\d+)', sessionController.timeout, quizController.show);
  router.get('/quizes/:quizId(\\d+)/answer', sessionController.timeout, quizController.answer);
  router.get('/lista', sessionController.timeout, statisticsController.lista);
  router.get('/quizes/new', sessionController.timeout, sessionController.loginRequired, quizController.new);
  router.post('/quizes/create', sessionController.timeout, sessionController.loginRequired, multer({ dest: './public/media/'}), quizController.create);
  router.get('/quizes/:quizId(\\d+)/edit', sessionController.timeout, sessionController.loginRequired, userController.ownershipRequired, quizController.edit);
  router.put('/quizes/:quizId(\\d+)', sessionController.timeout, sessionController.loginRequired, userController.ownershipRequired, multer({ dest: './public/media/'}),  quizController.update);
  router.delete('/quizes/:quizId(\\d+)', sessionController.timeout, sessionController.loginRequired, userController.ownershipRequired, quizController.destroy);

// Definición de rutas de comentarios.
  router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
  router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
  router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.timeout, sessionController.loginRequired, userController.ownershipRequired, commentController.publish);

  router.get('/author', quizController.author);

//DEFINICIÓN DE RUTAS DE /favourites
router.get('/user/:userId(\\d+)/favourites',  favController.index);
router.put('/user/:userId(\\d+)/favourites/:quizId(\\d+)',  favController.fav);
router.delete('/user/:userId(\\d+)/favourites/:quizId(\\d+)',  favController.unfav);

module.exports = router;