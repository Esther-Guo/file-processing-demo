const form = document.getElementById("form");

// form.addEventListener("submit", submitForm);

// function submitForm(e) {
//     e.preventDefault();
//     const files = document.getElementById("files");
//     const formData = new FormData();
//     for(let i =0; i < files.files.length; i++) {
//         formData.append("files", files.files[i]);
//     }
//     fetch("http://localhost:5001/upload_files_merge", {
//         method: "POST",
//         body: formData,
//     })
//         .then(res => console.log(res))
//         .catch(err => ("Error occured", err));
// }

const button1 = document.getElementById("submit-btn-1");
button1.addEventListener("click", () => {
    const files = document.getElementById("files");
    const formData = new FormData();
    for(let i =0; i < files.files.length; i++) {
        formData.append("files", files.files[i]);
    }
    fetch("http://localhost:5001/upload_files_merge", {
        method: "POST",
        body: formData,
    })
        .then(res => {
            if (res.status === 200) {
                document.getElementById("download-btn").style.display = "inline-block"
                document.getElementById("reminder").style.display = "inline-block"
            }
        })
        .catch(err => ("Error occured", err));
})

const button2 = document.getElementById("submit-btn-2");
button2.addEventListener("click", (e) => {
    // e.preventDefault();
    const files = document.getElementById("files");
    const formData = new FormData();
    for(let i = 0; i < files.files.length; i++) {
        formData.append("files", files.files[i]);
    }
    fetch("http://localhost:5001/upload_files", {
        method: "POST",
        body: formData,
    })
        .then(res => {
            if (res.status === 200) {
                document.getElementById("download-btn").style.display = "inline-block"
                document.getElementById("reminder").style.display = "inline-block"
            }
        })
        .catch(err => ("Error occured", err));
})


// let myDropzone = new Dropzone("#my-form");
// myDropzone.on("addedfile", file => {
//   console.log(`File added: ${file.name}`);
// });


// const downloadBtn = document.getElementById("download-btn");

// downloadBtn.addEventListener("click", downloadFile);

// function downloadFile() {
//     fetch("http://localhost:5001/download", {
//         method: "GET"
//     })
//         .then(res => console.log(res))
//         .catch(err => ("Error in downloading file.", err))
// }