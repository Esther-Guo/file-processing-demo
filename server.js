(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

const express = require("express");
const {spawn} = require("child_process");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
const upload = multer({storage: storage})
const cors = require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


const app = express();
const port = 5001;
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/upload_files", upload.array("files"), uploadFiles);

function uploadFiles(req, res) {
    let dataToSend;
    const python = spawn('python3', ['wordFreq.py']);
    // python.stdout.on('data', function (data) {
    //     console.log('Pipe data from python script ...');
    //     dataToSend = data.toString();
    // });
    // python.on('close', (code) => {
    //     console.log(`child process close all stdio with code ${code}`);
    //     console.log(dataToSend)
    //     // send data to browser
    //     // res.send(dataToSend)
    // });
    return new Promise( (resolve) => {
        python.on('exit', () => resolve("finish processing"))
    })
    // res.download("./output/temp.xlsx")

    // console.log(req.body);
    // console.log(req.files);
    // res.json({ message: "Successfully uploaded files" });
}

app.get('/download', downloadFile);

function downloadFile(req, res) {
    res.download("./output/temp.xlsx", "output.xlsx", err => {
        if (err) {res.send({error: err, msg: "Problem downloading the file"})}
    })
}

app.listen(port, () => console.log("Server started ..."));