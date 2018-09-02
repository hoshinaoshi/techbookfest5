var express = require('express')
var app = express()
var AWS = require('aws-sdk');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('sync-request');

var multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty();

AWS.config.update(
  {
    accessKeyId:     process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
);
AWS.config.region = 'us-west-2';

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function httpRequest(method, url, body) {
  var options = { 
    method: method,
    url: url,
    body: body,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json'
    },  
  };  
  return request(method, url, options);
}

app.post('/upload', multipartyMiddleware, function (req, res) {
  var s3 = new AWS.S3();

  var file = req.files.file;
  var buffer = fs.readFileSync(file.path);

  var startTime = new Date();
  var partNum = 0;
  var partSize = 1024 * 1024 * 5; // S3のマルチパートの最低サイズは5MB
  var numPartsLeft = Math.ceil(buffer.length / partSize);
  var maxUploadTries = 3;

  var multipartParams = {
    Bucket: 'bfftest',
    Key: file.name,
    ContentType: file.type
  };

  var multipartMap = {
    Parts: []
  };

  console.log('Creating multipart upload for:', file.name);
  s3.createMultipartUpload(multipartParams, function(err, multipart) {
    if (err) return console.error(err);
    console.log('Got upload ID', multipart.UploadId);

    for (var start = 0; start < buffer.length; start += partSize) {
      partNum++;
      var end = Math.min(start + partSize, buffer.length);
      var partParams = {
        Body: buffer.slice(start, end),
        Bucket: multipartParams.Bucket,
        Key: multipartParams.Key,
        PartNumber: String(partNum),
        UploadId: multipart.UploadId
      };

      console.log('Uploading part: #', partParams.PartNumber, ', Start:', start);
      uploadPart(s3, multipart, partParams);
    }
  });

  function uploadPart(s3, multipart, partParams, tryNum) {
    var tryNum = tryNum || 1;
    s3.uploadPart(partParams, function(partErr, partData) {
      console.log('started');
      if (partErr) {
        console.log('Upload part error:', partErr);

        if (tryNum < maxUploadTries) {
          console.log('Retrying upload of part: #', partParams.PartNumber);
          uploadPart(s3, multipart, partParams, tryNum + 1);
        } else {
          console.log('Failed uploading part: #', partParams.PartNumber);
        }
      }

      multipartMap.Parts[this.request.params.PartNumber - 1] = {
        ETag: partData.ETag,
        PartNumber: Number(this.request.params.PartNumber)
      };
      console.log('Completed part', this.request.params.PartNumber);
      console.log('partData', partData);
      if (--numPartsLeft > 0) return;

      var doneParams = {
        Bucket: multipartParams.Bucket,
        Key: multipartParams.Key,
        MultipartUpload: multipartMap,
        UploadId: multipart.UploadId
      };

      console.log('Completing upload...');
      s3.completeMultipartUpload(doneParams, function(err, data) {
        if (err) return console.error(err);
        var delta = (new Date() - startTime) / 1000;
        console.log('Completed upload in', delta, 'seconds');
        console.log('Final upload data:', data);
        httpRequest(
          "POST",
          "https://requestloggerbin.herokuapp.com/bin/bf985753-3191-47f1-b014-9324d1126aa8",
          Buffer.alloc(128, data)
        )
      });
    }).on('httpUploadProgress', function(progress) {
      console.log(Math.round(progress.loaded/progress.total*100)+ '% done')
    });
  }

  res.send("complute");
})

app.listen(3000)
