//Load the mongoose driver
const mongoose = require('mongoose');

module.exports = {
    async index(request,response) {
        const ImageName = 'bird.png';

        //Connect to MongoDB and its database
        mongoose.connect(
            'mongodb+srv://<username>:<password>@cluster0-mdpym.mongodb.net/filesDB?retryWrites=true&w=majority',
            {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
            },
        );
        //The Connection Object
        const connection = mongoose.connection;
        
        if (connection !== 'undefined') {
            console.log(connection.readyState.toString());
            
            //4. The Path object
            const path = require('path');
            //5. The grid-stream
            const grid = require('gridfs-stream');
            //6. The File-System module
            const fs = require('fs');
            //7.Create the video/image file from the filesDownloaded folder
            const filesrc = path.join(__dirname, `./filesDownloaded/${ImageName}`);

            //8. Establish connection between Mongo and GridFS
            grid.mongo = mongoose.mongo;
            //9.Open the connection and read file
            connection.once('open', () => {
                console.log('Connection Open');
                const gridfs = grid(connection.db);
                if (gridfs) {
                    //9a. create a stream, this will be
                    //used to store file out database
                    const fsstreamwrite = fs.createWriteStream(filesrc);
                    console.log(fsstreamwrite);
                    const readstream = gridfs.createReadStream({
                        filename: `${ImageName}`
                    });
                    //9b. create a readstream to read the file
                    //from the filestored folder
                    //and pipe from the database
                    readstream.pipe(fsstreamwrite);
                    //9c. Complete the write operation
                    readstream.on('close', function (file) {
                        console.log('File read successfully from database');
                        return response.json({ message:'Photo read successfully in database' });
                    });
                } else {
                    console.log('Sorry No Grid FS Object');
                    return response.json({ message:'Sorry No Grid FS Object' });
                }
            });
        } else {
        
            console.log('Sorry not connected');
            return response.json({ message:'Sorry not connected' });
        }
        console.log('done');
    },
}
