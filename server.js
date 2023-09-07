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
const fs = require('fs');

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
const path = require("path");
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

app.post("/upload_files_merge", upload.array("files"), (req, res) => {
    console.log(req.files);
    const files = req.files;
    processFilesMerge(files, () => {
        console.log("All files uploaded and processed successfully!");
        res.status(200).send("Files uploaded and processed successfully!");
    });
});

function uploadFiles(req, res) {
    console.log(req.files);
    const files = req.files;
    processFilesMerge(files, () => {
        console.log("All files uploaded and processed successfully!");
        res.status(200).send("Files uploaded and processed successfully!");
    });
    // const python = spawn('python3', ['wordFreq.py']);
    // python.stdout.on('data', (data) => {
    //     console.log(`Output from python script: ${data}`);
    // });

    // python.on('close', (code) => {
    //     // console.log(`child process close all stdio with code ${code}`);
    //     // console.log(dataToSend)
    //     // send data to browser
    //     // res.send(dataToSend)
    // });
    // return new Promise( (resolve) => {
    //     python.on('exit', () => resolve("finish processing"))
    // })
    // res.download("./output/temp.xlsx")

    // console.log(req.body);
    // console.log(req.files);
    // res.json({ message: "Successfully uploaded files" });
}

function processFilesMerge(files, callback) {
    const python = spawn('python3', ['wordFreqMerge.py']);
    python.on('error', (error) => {
        console.error(`Error occurred: ${error}`);
    });
    python.stdout.on('data', (data) => {
        console.log(`Output from python script: ${data}`);
    });

    python.on('close', () => {
        callback(); // Call the callback function when all files are processed
    });
    // const fileCount = files.length;
    // let processedCount = 0;

    // files.forEach((file) => {
    //     const python = spawn('python3', ['wordFreq.py', file.path]);
    //     python.stdout.on('data', (data) => {
    //         console.log(`Output from python script: ${data}`);
    //     });

    //     python.on('error', (error) => {
    //         console.error(`Error occurred: ${error}`);
    //     });

    //     python.on('close', () => {
    //         processedCount++;
    //         if (processedCount === fileCount) {
    //             callback(); // Call the callback function when all files are processed
    //         }
    //     });
    // });
}

app.post("/upload_files", upload.array("files"), (req, res) => {
    console.log(req.files);
    const files = req.files;
    processFiles(files, () => {
        console.log("All files uploaded and processed successfully!");
        res.status(200).send("Files uploaded and processed successfully!");
    });
});
function processFiles(files, callback) {
    const python = spawn('python3', ['wordFreq.py']);
    python.on('error', (error) => {
        console.error(`Error occurred: ${error}`);
    });
    python.stdout.on('data', (data) => {
        console.log(`Output from python script: ${data}`);
    });

    python.on('close', () => {
        callback(); // Call the callback function when all files are processed
    });
}

app.get('/download', downloadFile);

function downloadFile(req, res) {
    const dir = './output';

    fs.readdir(dir, (err, files) => {
        if (err) console.log(err);
        else {
            // if it was a merge task, download directly
            if (files.includes("wordFreq.xlsx")) {
                res.download("./output/wordFreq.xlsx", err => {
                    if (err) {res.send({error: err, msg: "Problem downloading the file"})}
                })
            }
            // otherwise, make a zip file
            else {
                const zip = require('express-zip');
                res.zip(files.map(file => ({path: "./output/"+file, name: file})))
            }
        }
    });

    setTimeout(clearFolder, 1000);
}

function clearFolder() {
    fs.readdir("./uploads", (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join("./uploads", file), (err) => {
            if (err) throw err;
          });
        }
    });
    fs.readdir("./output", (err, files) => {
        if (err) throw err;
        
        for (const file of files) {
            fs.unlink(path.join("./output", file), (err) => {
            if (err) throw err;
            });
        }
    });
}

app.listen(port, () => console.log("Server started ..."));