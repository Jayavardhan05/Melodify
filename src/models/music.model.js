const mongoose= require('mongoose');

const MusicSchema = new mongoose.Schema({
    uri:{
        type: String,
        required: true,
    }
    ,
    title:
    {
        type: String,
        required: true,
    },
    artist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    }
});

const MusicModel = mongoose.model('Music', MusicSchema);

module.exports= MusicModel;