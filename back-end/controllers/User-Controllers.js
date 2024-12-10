const User = require('../models/User-Model.js');
const Enroll = require('../models/Enrollment-model.js');
const bcryptjs = require('bcryptjs');
const auth = require('../auth.js');

module.exports.registerUser = (req, res) => {
    let newUser = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        password: bcryptjs.hashSync(req.body.password, 10)
    });

    return newUser.save()
    .then(result => {
        res.send({
            code: "REGISTRATION-SUCCESS",
            message: "You are now registered!",
            result: result
        });
    })
    .catch(error => {
        res.status(500).send({
            code: "REGISTRATION-FAILED",
            message: "We've encountered an error during the registration. Please try again!",
            error: error
        });
    });
};

module.exports.getAllUsers = (req, res) => {
    return User.find({}).then(result => {
        if(result == null || result.length === 0){
            return res.send({
                code: "USER-EMPTY",
                message: "There is currently no User."
            })
        }else{
            return res.send({
                code: "ALL-USERS-RESULT",
                message: "Here are the list of users.",
                result: result
            })
        }
    })
}

// User Login
module.exports.loginUser = (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(404).send({
                code: "USER-NOT-REGISTERED",
                message: "User not registered"
            });
        }

        const isMatch = bcryptjs.compareSync(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                code: "INCORRECT-PASSWORD",
                message: "Incorrect password"
            });
        }

        const token = auth.createAccessToken(user);
        res.send({ token });
    })
    .catch(error => {
        res.status(500).send({
            code: "LOGIN-FAILED",
            message: "We've encountered an error during login. Please try again!",
            error: error
        });
    });
}

// Check email if existing
module.exports.checkEmail = (req,res) => {
    let {email} = req.body;
    return User.find({email: email}).then(result => {
        if(result.length > 0){
            return res.send({
                code: "EMAIL-EXISTS",
                message: "The user is registered."
            })
        }else{
            return res.send({
                code: "EMAIL-NOT-EXISTING",
                message: "The user is not registered."
            }) 
        }
    })
}

module.exports.getProfile = (req, res) => {
    const {id} = req.user;
    return User.findById(id).then(result => {
        if(result == null || result.length === 0){
            return res.send({
                code: "USER-NOT-FOUND",
                message: "Cannot find user with the provided ID."
            })
        }else{
            result.password = "*****";
            return res.send({
                code: "USER-FOUND",
                message: "A user was found.",
                result: result
            })
        }
    })
}

module.exports.updateProfile = (req, res) => {
    const { id } = req.user;
    const { firstName, middleName, lastName, email, contactNumber, password } = req.body;

    const updateData = { firstName, middleName, lastName, email, contactNumber };

    if (password) {
        updateData.password = bcryptjs.hashSync(password, 10);
    }
    User.findOne({ email }).then((existingUser) => {
        if (existingUser && existingUser._id.toString() !== id) {
            return res.send({
                code: "EMAIL-ALREADY-EXISTS",
                message: "The email is already in use. Please choose a different email.",
            });
        }
    User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.send({
                    code: "USER-NOT-FOUND",
                    message: "Cannot find user with the provided ID.",
                });
            }
            res.send({
                code: "USER-UPDATE-SUCCESS",
                message: "Profile updated successfully.",
                result: updatedUser,
            });
        })
        .catch((error) => {
            if (error) {
                res.send({
                    code: "EMAIL-ALREADY-EXISTS",
                    message: "The email is already in use. Please choose a different email.",
                });
            } else {
                res.send({
                    code: "USER-UPDATE-FAILED",
                    message: "An error occurred while updating the profile.",
                    error: error.message,
                });
            }
        });
    })
};

module.exports.updateUser = (req, res) => {
    const { id, updatedDetails } = req.user;

    console.log("Target ID:", id); // Log the target user ID
    console.log("Updated Details:", updatedDetails); // Log the updated details

    if (!req.user.isAdmin) {
        return res.status(403).send({
            code: "NOT-AUTHORIZED",
            message: "You are not authorized to perform this action.",
        });
    }

    User.findByIdAndUpdate(
        id,
        { ...updatedDetails },
        { new: true, runValidators: true } // Return updated document and validate changes
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).send({
                    code: "USER-NOT-FOUND",
                    message: "No user found with the provided ID.",
                });
            }
            console.log("Updated User:", updatedUser); // Log the updated user details
            res.send({
                code: "UPDATE-SUCCESS",
                message: "Profile updated successfully.",
                result: updatedUser, // Return the updated user details
            });
        })
        .catch((error) => {
            console.error("Update Error:", error); // Log the error
            res.status(500).send({
                code: "UPDATE-FAILED",
                message: "An error occurred while updating the user.",
                error,
            });
        });
};

module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ result: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports.updateUserPassword = async (req, res) => {
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(newPassword, salt);
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Enroll a user
module.exports.enroll = (req, res) => {
    const {id} = req.user;
    
    let newEnrollment = new Enroll({
        userId: id,
        enrolledCourse: req.body.enrolledCourse,
        totalPrice: req.body.totalPrice
    })

    return newEnrollment.save().then((result, err) => {
        if(err){
            res.send({
                code: "ENROLLMENT-FAILED",
                message: "There is a problem during your enrollment, please try again!",
                error: err
            })
        }else{
            res.send({
                code: "ENROLLMENT-SUCCESSFUL",
                message: "Congratulations, you are now enrolled!",
                result: result
            })
        }
    })
}

module.exports.updateUserDetails = async (req, res) => {
    const { firstName, middleName, lastName, email, contactNumber, password, isAdmin } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.middleName = middleName || user.middleName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.contactNumber = contactNumber || user.contactNumber;
        user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);
        }

        const updatedUser = await user.save();
        res.json({ msg: 'User updated successfully', result: updatedUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};