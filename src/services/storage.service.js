const {ImageKit}= require("@imagekit/nodejs")


const ImageKitInstance= new ImageKit({
    publicKey: process.env['IMAGEKIT_PUBLIC_KEY'],
    privateKey: process.env['IMAGEKIT_PRIVATE_KEY'],
    urlEndpoint:process.env['IMAGEKIT_URL_ENDPOINT']
});

async function uploadFile(file){
    const result = await ImageKitInstance.files.upload({
        file,
        fileName: `music_${Date.now()}.mp3`,
        folder: "music_uploads"
    });
    return result;
}

module.exports= {uploadFile};