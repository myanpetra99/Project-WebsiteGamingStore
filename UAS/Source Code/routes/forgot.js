const express = require('express')
const router = express.Router()
const Users = require('../models/user')
var async = require('async')
const crypto = require('crypto')
var bcrypt = require('bcrypt')
var nodemailer = require('nodemailer')

router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        Users.findOne({ email: req.body.forgotemail }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            console.log('error no user with that email')
            return res.redirect('/login');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
            console.log('Silahkan ceck email')
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "noreply.agstore@gmail.com",
              pass: "@dmin1234"
            }
        });
        var mailOptions = {
          from: 'noreply.agstore@gmail.com',
          to: user.email,
          subject: 'Reset Password Request - AGStore',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            html: "<h1 style='text-align: center;'>AGStore </h1> <br> <p style='text-align: center;'>You are receiving this because you (or someone else) have requested the reset of the password for your account. <br>Please click on the following link, or paste this into your browser to complete the process: <br> <a href='http://" + req.headers.host + '/reset/' + token+"'><h2 style='text-align: center;'>Reset Password</h2></h2></a></p> <br> <strong style='text-align: center;'>If you did not request this, please ignore this email and your password will remain unchanged.</strong>"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/login');
      console.log('error gan')
      console.log(err)
    });
  });


  router.get('/reset/:token',  function(req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      var token = fullUrl.match('[^\/]+$').toString()  
    Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/login');
      }
      res.render('pages/auth/reset', {
        user: req.user, token: token
      });
    });
  });

  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async function (err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
          user.password = await bcrypt.hash(req.body.password, 10);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
  
          user.save();
          done(err, user)
          });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "noreply.agstore@gmail.com",
            pass: "@dmin1234"
          }
        });
        var mailOptions = {
          from: 'noreply.agstore@gmail.com',
            to: user.email,
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
          };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
        console.log(err)
      res.redirect('/login');
    });
  });


  module.exports = router