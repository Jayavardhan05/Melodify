const userModel= require('../models/user.model');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcrypt');

async function register(req, res){
    const {username, email, password, role="user"}= req.body;
    try {
        const existingUser= await userModel.findOne({
            $or: [{username}, {email}]

        });
        if(existingUser){
            return res.status(400).json({message: 'Username or email already in use'});
        }
        const hash=await bcrypt.hash(password, 10);
        const user=await userModel.create({username, email, password: hash, role});
        
        const token =jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET);

            res.cookie("token",token)

            res.status(201).json({message: 'User registered successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });


    }
    catch (error) {
        console.error('Error checking existing user:', error);
        return res.status(500).json({message: 'Server error'});
    }
}
 async function login(req, res){
    const {username ,email, password}= req.body;
    
        const user= await userModel.findOne({ 
            $or: [{username}, {email}]
        });
        if(!user){
            return res.status(400).json({message: 'Invalid username or email'});
        }
        const ispasswordValid= await bcrypt.compare(password, user.password);

        if (!ispasswordValid){
            return res.status(400).json({message: 'Invalid Credentials'});
        }

        const token =jwt.sign({
            id:user._id,
            role: user.role
        },
        process.env.JWT_SECRET);
        res.cookie("token",token);

        res.status(200).json({message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    
}

module.exports= {register,login};