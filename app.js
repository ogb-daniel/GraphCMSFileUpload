import dotenv from 'dotenv'
import express from 'express';
import FormData  from 'form-data';
import fetch from 'node-fetch';
import multer from 'multer'
import cors from 'cors'
import {Blob} from 'buffer';
import fs from 'fs'

dotenv.config();
const app = express();
app.use(cors({
    origin:'*'
}))

  
  const upload = multer({ dest: 'uploads/' });

  app.get('/',()=>{
    res.send('Yo.....send requests to /upload to upload your file')
  })

app.post('/upload', upload.single('image'), (req, res, next) => {
  const fileUpload = req.file;

  if (!fileUpload) {
    const error = new Error('No file attached');
    error.status = 400;
    return next(error);
  }
  const blob =  new Blob([JSON.stringify(formData)])

  let url = URL.createObjectURL(blob)

  var formData = {
    fileData: {
        value: fileUpload.buffer,
        filename: fileUpload.originalname
    },
    fileName: fileUpload.originalname,
  }

  const form = new FormData();
//   form.append('image', new Blob([JSON.stringify(formData)],{type:'application/json'}), fileUpload.originalname);

form.append('fileUpload', fs.createReadStream(fileUpload.path));

 
  console.log(url);

  fetch(`${process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form
  })
    .then((response) => response.json())
    .then((data) => {res.send(data)});
});
app.listen(4000, () => {
    console.log('Running on port 4000');
  });