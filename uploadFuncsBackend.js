var aws = require('aws-sdk');
require('dotenv').config(); // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: 'us-west-1', // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
})

const S3_BUCKET = process.env.Bucket
// Now lets export this function so we can call it from somewhere else
exports.sign_s3 = (req, res) => {
  // console.log('signing s3 right now')
  const s3 = new aws.S3();  // Create a new instance of S3
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
  console.log(req.body)

  // Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    // ContentType: 'application/'+fileType,
    // ContentDisposition: `attachment; filename="${fileName + '.' + fileType}";`,
    ACL: 'public-read'
  };
  // const params = {
  //   Body: req.body.file, 
  //   Bucket: S3_BUCKET, 
  //   Key: fileName, 
  //   ContentDisposition: `attachment; filename="${fileName + '.' + fileType}";`, // from `originalname`
  //   ContentType: 'application/'+fileType, // from `mimetype`

  // }
  // s3.putObject(params, function(err, data) {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else{
  //     console.log(data);           // successful response
  //     res.sendStatus(200)
  //   }
  // });
  

// Make a request to the S3 API to get a signed URL which we can use to upload our file
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      // console.log('ERROR GETSIGNEDURL')
      res.json({ success: false, error: err })
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    // Send it all back
    res.json({ success: true, data: { returnData } });
  });


}