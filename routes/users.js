var express = require('express');
var router = express.Router();
var path = require('path');

var mongoose = require('mongoose');
var users = mongoose.model('users');
var multer = require('multer');
var upload = multer();

//1
router.use(express.static(__dirname+"/public/"));

//2
// var storage = multer.diskStorage({
//   destination:"./public/uploads",
//   filename: (req, file, cb) => {
//     cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
//   }
// });

//3
// var upload = multer({
//   storage:storage
// });

/* GET users listing. */
router.get('/',upload.single('file') ,function(req, res) {
  users.find(function(err, dbUsers){
    res.render(
      'users',
      {title: 'Users list', data:dbUsers}
    );
  });
});

router.post('/search', function(req,res){
  users.find({'firstname':{$regex: req.body.q}}, function(err, dbUsers){
    res.render( 
      'users',
      {title:'Users list', data: dbUsers}
    );
  });
});

router.get('/add', function(req,res){
  res.render(
    'add',
    {title: 'Add new user'}
  );
});

router.post('/add',upload.single('file'), function(req,res){
  new users({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    birth_date: req.body.birth_date,
    phoneNumber: req.body.phoneNumber,
    email:req.body.email,
    userRole: req.body.userRole,
    // image: req.file.filename
  }).save(function(err){
    if(err){
      res.json(err);
    }else{
      res.redirect('/users')
    }
  });
});

router.param('id', function(req,res, next, id){
  users.findById(id, function(err, dbUsers){
    if(err){
      res.json(err);
    }else{
      req.usersId = dbUsers;
      next();
    }
  });
});

router.get('/:id',upload.single('file'), function(req,res){
  res.render('detail', {userData:req.usersId});
});

router.get('/:id/edit', function(req,res){
  res.render('edit', {userData: req.usersId})
});

router.post('/:id',upload.single('file'), function(req, res){
  users.findByIdAndUpdate({_id:req.params.id},
    {
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      birth_date: req.body.birth_date,
      phoneNumber: req.body.phoneNumber,
      email:req.body.email,
      userRole: req.body.userRole,
      // image: req.file.filename
    }, function(err,dbUsers){
      if(err){
        res.json(err);
      }else{
        res.redirect('/users');
      }
    });
});

router.post('/deleteuser/:id', function(req,res){
  users.findByIdAndRemove({_id:req.params.id},
    function(err, dbUsers){
      if(err){
        res.json(err);
      }else{
        res.redirect('/users');
      }
    });
});



module.exports = router;
