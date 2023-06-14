const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/create', auth, async (req, res) => {
    try {
        if (req.user.admin) {
            const { fname, lname, email, password } = req.body;

            let user = await User.findOne({email});
            if (user) {
                throw new Error('User already exists');
            }
    
            user = {
                fname: fname,
                lname: lname,
                email: email,
                password: password
            };
    
            const newUser = new User(user);
            await newUser.save();
            const token = await newUser.generateAuthToken();
            res.status(200).send({ status: 'User Created', user: newUser, token: token });
        } else {
            throw new Error('Only Admin Function.');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/get', auth , async (req, res) => {
    try {
        res.status(200).send({ status: 'User fetched', user: req.user });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/getall', auth , async (req, res) => {
    try {
	if (req.user.admin) {
		const users = await User.find();
        	res.status(200).send({ status: 'User fetched', users: users });
	} else {
	     throw new Error('Only Admin Function.');
	}
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.patch('/update', auth, async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;
	if (email != req.user.email) {
		const find_user = await User.findOne({email});
		if (find_user) {
			throw new Error('Email already exists');
		}
	}
	let user;
	if (password == "") {
	user = {
            fname: fname,
            lname: lname,
            email: email
        }; } else {
	const hashPassword = await bcrypt.hash(password, 8);
	user = {
            fname: fname,
            lname: lname,
            email: email,
            password: hashPassword
        }; }

        const updateUser = await User.findByIdAndUpdate(req.user.id, user);
        res.status(200).send({ status: 'User updated', updated_user: user });
    } catch (err) {
	console.log(err)
        res.status(500).send(err.message);
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const userID = req.params.id;
	console.log(userID)
        if (req.user.id == userID || req.user.admin) {
            const user = await User.findById(userID);
            if (!user) {
                throw new Error('There is no user to delete');
            }
            const deleteUser = await User.findByIdAndDelete(userID);
            res.status(200).send({ status: 'User deleted', deleted_user: deleteUser });
        } else {
            throw new Error('You have not permission to delete user.');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/delete', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
           throw new Error('There is no user to delete');
        }
        const deleteUser = await User.findByIdAndDelete(req.user.id);
        res.status(200).send({ status: 'User deleted', deleted_user: deleteUser });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.status(200).send({ status: 'Login success', token: token, user: user });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();
        res.status(200).send('Logout successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;