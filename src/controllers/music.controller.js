const musicModel= require('../models/music.model');
const albumModel= require('../models/album.model');
const {uploadFile}= require('../services/storage.service');
const jwt= require('jsonwebtoken');

async function createMusic(req, res){
     
    const token= req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    let decoded;
    try{
        decoded= jwt.verify(token,process.env.JWT_SECRET);
        if (decoded.role !=='artist'){
            return res.status(403).json({message: 'Forbidden: Only artists can upload music'});
        }
    }catch(err){
        return res.status(401).json({message: 'Invalid token'});
    }

    const {title}=req.body;
    const fileBuffer=req.file.buffer;


    const result =await uploadFile(fileBuffer.toString('base64'));

    const music= await musicModel.create({
        uri:result.url,
        title,
        artist: decoded.id
    });

    res.status(201).json({message: 'Music uploaded successfully',
        music: {
            id: music._id,
            title: music.title,
            artist: music.artist,
            uri: music.uri
        }
    });

}


async function createAlbum(req, res){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    let decoded;
    try{
        decoded= jwt.verify(token,process.env.JWT_SECRET);

        if (decoded.role !=='artist'){
            return res.status(403).json({message: 'Forbidden: Only artists can create albums'});
        }

        const {title, musics}= req.body;

        const album= await albumModel.create({
            title,
            musics: musics,
            artist: decoded.id
        });

        res.status(201).json({message: 'Album created successfully', album});

    }
    catch(err){
        return res.status(401).json({message: 'Invalid token'});
    }


}  

module.exports= {createMusic, createAlbum};