//Load the mongoose driver
const mongoose = require('mongoose');

module.exports = {   
    async store(request,response) {
        const { ImageName } = request.body;

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

            const path = require('path');
            const grid = require('gridfs-stream');
            const fs = require('fs');
            const filesrc = path.join(__dirname, `./filesToStore/${ImageName}`);
            
            //Establish connection between Mongo and GridFS
            grid.mongo = mongoose.mongo;
            //Open the connection and write file
            connection.once('open', () => {
                console.log('Connection Open');
                const gridfs = grid(connection.db);
                if (gridfs) {
                    //9a. create a stream, this will be
                    //used to store file in database
                    const streamwrite = gridfs.createWriteStream({
                        //the file will be stored with the name
                        filename: `${ImageName}`
                    });
                    //9b. create a readstream to read the file
                    //from the filestored folder
                    //and pipe into the database
                    fs.createReadStream(filesrc).pipe(streamwrite);
                    //9c. Complete the write operation
                    streamwrite.on('close', function (file) {
                        console.log('Photo written successfully in database');
                        return response.json({ message:'Photo written successfully in database' });
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

