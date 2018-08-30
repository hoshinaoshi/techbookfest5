var express = require('express')
var app = express()
var AWS = require('aws-sdk');
var bodyParser = require('body-parser');
var fs = require('fs');
var zlib = require('zlib'); // gzip compression

var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
AWS.config.region = 'us-west-2';

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/upload', multipartyMiddleware, function (req, res) {
  var s3 = new AWS.S3();

  var file = req.files.file;
  var buffer = fs.readFileSync(file.path);

  var startTime = new Date();
  var partNum = 0;
  var partSize = 1024 * 1024 * 5; // 5mb chunks except last part
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
  s3.createMultipartUpload(multipartParams, function(mpErr, multipart) {
    if (mpErr) return console.error('Error!', mpErr);
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

  function completeMultipartUpload(s3, doneParams) {
    s3.completeMultipartUpload(doneParams, function(err, data) {
      if (err) {
        console.error('An error occurred while completing multipart upload');
        console.error(err);
        return 
      }
      var delta = (new Date() - startTime) / 1000;
      console.log('Completed upload in', delta, 'seconds');
      console.log('Final upload data:', data);
    });
  }

  function uploadPart(s3, multipart, partParams, tryNum) {
    var tryNum = tryNum || 1;
    s3.uploadPart(partParams, function(multiErr, mData) {
      console.log('started');
      if (multiErr) {
        console.log('Upload part error:', multiErr);

        if (tryNum < maxUploadTries) {
          console.log('Retrying upload of part: #', partParams.PartNumber);
          uploadPart(s3, multipart, partParams, tryNum + 1);
        } else {
          console.log('Failed uploading part: #', partParams.PartNumber);
        }
        // return;
      }

      multipartMap.Parts[this.request.params.PartNumber - 1] = {
        ETag: mData.ETag,
        PartNumber: Number(this.request.params.PartNumber)
      };
      console.log('Completed part', this.request.params.PartNumber);
      console.log('mData', mData);
      if (--numPartsLeft > 0) return; // complete only when all parts uploaded

      var doneParams = {
        Bucket: multipartParams.Bucket,
        Key: multipartParams.Key,
        MultipartUpload: multipartMap,
        UploadId: multipart.UploadId
      };

      console.log('Completing upload...');
      completeMultipartUpload(s3, doneParams);
    }).on('httpUploadProgress', function(progress) {  console.log(Math.round(progress.loaded/progress.total*100)+ '% done') });
  }

  // console.log(stream);
  // s3.upload(params).
  //   on('httpUploadProgress', function(progress) { console.log(progress); }).
  //   send(function(err, data) { console.log(err, data) });
  // var s3 = new AWS.S3();
  // var params = {Bucket: 'videos.imstillreallybored', Key: req.body.name, ContentType: req.body.type};
  // s3.getSignedUrl('putObject', params, function(err, url) {
  // 	if(err) console.log(err);
  // 	res.json({url: url});
  //
  // });
  // console.log(Math.round(progress.loaded/progress.total*100)+ '% done')
  res.send("complute");
})


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
