const express = require('express');
const multer = require('multer');
const AWS = require('./aws-config');

const app = express();
const port = 3000;

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve HTML form for file upload
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: 'textract-async-task',
    Key: 'async-doc-text/' + req.file.originalname, // Specifies the desired folder structure
    Body: req.file.buffer,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file to S3');
    }
    console.log('File uploaded successfully:', data.Location);
    return res.send('File uploaded successfully to S3');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
