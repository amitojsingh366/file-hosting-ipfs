const express = require('express')
const app = express()
const path = require('path'); 

const fs = require('fs');

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/', upload.single('avatar'), function (req, res, next) {
    var data = new Buffer(fs.readFileSync(req.file.path));
    ipfs.add(data, function (err,file){
        if(err){
            console.log(err);
        }
        console.log(file);
        res.send('https://ipfs.io/ipfs/'+file[0].hash);
    });

    let resultHandler = function (err) {
        if (err) {
            console.log("unlink failed", err);
        } else {
            console.log("file deleted");
        }
    }

    fs.unlink(req.file.path, resultHandler);
  });
 
  app.listen(process.env.PORT || 3000);