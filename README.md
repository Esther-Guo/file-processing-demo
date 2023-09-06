# file-processing-demo
A web tool for XiaoYang to generate word frequency file.

### Stack
Node.js + Express.js
Python (word frequency script)

### Implementation Detail

**Thanks to GPT4** that gives such detailed implementation step by step.

- [x] Set up a web server: You need a web server to host your webpage and handle the file uploads and downloads. There are several options available, but one of the easiest and widely used solutions is to use Node.js with Express.js. This will allow you to handle HTTP requests easily.
- [x] Create a webpage: Design and build a webpage with an upload button where users can select and upload files. You can use HTML, CSS, and JavaScript for this purpose. There are also libraries available, like Dropzone.js, that can simplify the file upload process.
- [x] Handle file uploads on the server: When a file is uploaded, you need to handle it on the server-side. In your Express.js server, you can use the "multer" middleware to handle file uploads. Multer simplifies the process of handling multipart/form-data, which is used for file uploads.
- [x] Process the uploaded files: Once the file is uploaded, you can run your Python script to process it. You can use child_process.spawn in Node.js to execute the Python script as a child process. Pass the uploaded file to the Python script as a command-line argument or through standard input, depending on your script's requirements.
- [x] Save the script output: After the Python script completes its execution and generates an output file, you can save it on the server's file system. You can choose a specific location or create a dedicated directory to store these output files. You can retrieve the output file path and send a download link to the client, or directly push the file to download with res.download(filePath). 
- [x] Enable download for users: Once the output file is saved, you need to provide a way for users to download it. You can create a download link on your webpage that points to the saved output file on the server. When a user clicks the download link, the file will be downloaded to their device.

### TODOs
- [ ] Use Dropzone.js for better UX
- [x] Save uploaded file with original name
- [ ] Add timestamp to distinguish each task
- [ ] Support merging files into one
- [ ] Support generating zip for multiple files [reference](https://www.geeksforgeeks.org/how-to-download-a-file-using-express-js/)
- [ ] Change 'Download' status once finish processing
- [ ] Project deployment on Azure server [reference](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-vscode)