const AWS = require('aws-sdk');
const bluebird = require('bluebird');
const { saveError } = require('../utilities/logger');


AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  
  AWS.config.setPromisesDependency(bluebird);
  
  // create S3 instance
  const s3 = new AWS.S3();
  
  exports.getDownloadLink = async (req, res) => {
    if (!req.user) {
      console.log('unauthorized user:');
      saveError(
        context.user.id,
        2,
        'Only NCOICs and SCHs can download proofs of service'
      );
      return res.status(401).send('You are not authorized');
    }
    if (req.user.role_id !== 2 && req.user.role_id !== 3) {
      console.log('unauthorized user:');
      saveError(
        context.user.id,
        2,
        'Only NCOICs and SCHs can download proofs of service'
      );
      return res.status(401).send('You are not authorized');
    }
    console.log('downloadLink Hit');
  
    const url = await s3.getSignedUrl('getObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: req.body.fileKey,
      Expires: 60
    });
  
    res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
    return res.status(200).send(url);
  };
  