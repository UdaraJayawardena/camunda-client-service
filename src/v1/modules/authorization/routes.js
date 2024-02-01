const express = require('express');

const { AuthMiddleware } = require('@src/v1/middleware');

const Controller = require('./controller');

const Middleware = require('./middleware');

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileExtention = file.originalname.split('.');
    const fileName = file.fieldname + '.' + fileExtention[fileExtention.length - 1];
    cb(null, fileName);
  }
});

const upload = multer({ storage }); // dest: 'uploads/' 

router.route('/register')
  .post(Middleware.createAdminUsers);

router.route('/access-matrix')
  .post(
    upload.single('doc'),
    Middleware.validateAccessMatrixFile,
    Middleware.convertAccessFileToJson,
    Middleware.bindUsers,
    Middleware.bindRoles,
    Middleware.deleteUsers,
    Middleware.deleteAccessRights,
    Middleware.deleteTenants,
    Middleware.createAccessRights,
    Middleware.createTenants,
    Middleware.createUsers
  );

router.route('/sync')
  .post(
    AuthMiddleware.bindPermissions,
    Controller.syncPermissions
  );

module.exports = router;