const bcrypt = require('bcrypt');
const User = require('../models/User');
// const Enrollment = require("../models/Enrollment");
const auth = require('../auth');



// Register user
module.exports.registerUser = (req, res) => {
	if(!req.body.email.includes('@')) {
		return res.status(200).send({message : 'Invalid email format'})
	}

	if(req.body.password.length < 8){
		return res.status(200).send({ message: 'Password must be at least 8 characters' });
	}

    if (req.body.mobileNo.length !== 11){
        // if the mobile number is not in the correct number of characters, send a message 'Mobile number is invalid'.
        return res.status(400).send({ message: 'Mobile number is invalid' });
    }

	// Checking if email is already registered and if so, early exit
	User.findOne({email : req.body.email })
	.then(existingUser => {
		if(existingUser){
			return res.status(200).send({ message: 'Email Already Exists' });
		}
	

		const newUser = new User({
			email : req.body.email,
            mobileNo : req.body.mobileNo,
			password : bcrypt.hashSync(req.body.password, 10)
		});

		return newUser.save()
		.then(user => {
			res.status(201).send({
				message : 'Successfully Registered'
			});
		});
	})
	.catch(err => auth.errorHandler(err, req, res));
}

// Login
module.exports.loginUser = (req, res) => {
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				return res.status(200).send({ message: 'User not found' });
			}

			const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

			if (!isPasswordCorrect) {
				return res.status(200).send({ message: 'Incorrect password' });
			}

			res.status(200).send({
				access: auth.createAccessToken(user)
			});
		})
		.catch(err => auth.errorHandler(err, req, res));
};

// Get user details (profile)
module.exports.getProfile = (req, res) => {
  return User.findById(req.user.id)
    .select('-password')
    .then(user => {
      if (!user) {
        return res.status(200).send({ message: 'User not found' });
      }
      res.status(200).send(user);
    })
    .catch(error => auth.errorHandler(error, req, res)); // make sure `auth` is imported
};