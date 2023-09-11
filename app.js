const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {spawn} = require("child_process");
const multer = require("multer");
const fs = require('fs');

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
      callback(null, file.originalname)
  }
})
const upload = multer({
  storage: storage,
  // fix encoding for chinese characters
  fileFilter: (req, file, callback) => {
      file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
      callback(null, true);
  }
})
const cors = require("cors");
const corsOptions ={
 origin:'*', 
 credentials:true,            //access-control-allow-credentials:true
 optionSuccessStatus:200,
}

const app = express();
app.use(cors(corsOptions))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

uploadDir = path.join(__dirname, "uploads");
outputDir = path.join(__dirname, "output");


app.post("/upload_files_merge", upload.array("files"), (req, res) => {
  console.log(req.files);
  const files = req.files;
  processFilesMerge(files, () => {
      console.log("All files uploaded and processed successfully!");
      res.status(200).send("Files uploaded and processed successfully!");
  });
});

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
    fs.readdir(outputDir, (err, files) => {
        // console.log(files)
        if (err) console.log(err);
        else {
            // if it was a merge task, download directly
            if (files.includes("wordFreq.xlsx")) {
                res.download(path.join(outputDir, "wordFreq.xlsx"), err => {
                    if (err) {res.send({error: err, msg: "Problem downloading the file"})}
                })
            }
            // otherwise, make a zip file for more than one files
            else {
                if (files.length === 1) {
                    res.download(path.join(outputDir, files[0]), err => {
                        if (err) {res.send({error: err, msg: "Problem downloading the file"})}
                    })
                }
                else {
                    const zip = require('express-zip');
                    res.zip(files.map(file => ({path: path.join(outputDir, file), name: file})))
                }
            }
        }
    });

    setTimeout(clearFolder, 1000);
}

function clearFolder() {
    fs.readdir(uploadDir, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join(uploadDir, file), (err) => {
            if (err) throw err;
          });
        }
    });
    fs.readdir(outputDir, (err, files) => {
        if (err) throw err;
        
        for (const file of files) {
            fs.unlink(path.join(outputDir, file), (err) => {
            if (err) throw err;
            });
        }
    });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
