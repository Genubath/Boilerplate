/* eslint-disable no-console */
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name) => {
  const params = {
    Body: buffer,
    Bucket: process.env.BUCKET_NAME,
    Key: `${name}`
  };
  return s3.upload(params).promise();
};

// Post: /upload
// eslint-disable-next-line consistent-return
exports.upload = (req, res) => {
  if (!req.user) {
    console.log('unauthorized user:');
    return res.status(401).send('You are not authorized');
  }
  let uploadSuccess = true;
  console.log('uploadd url hit');

  const form = new multiparty.Form();
  form.parse(req, async (error, fields, files) => {
    if (error) throw new Error(error);
    // return res.status(200).send(files);
    // upload all of them

    const returnData = files.files.map(async (file) => {
      const { path } = file;
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const buffer = fs.readFileSync(path);
      const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `proofOfServiceDocs/${timestamp}_${
        file.originalFilename
      }`;
      console.log(fileName);
      try {
        const data = await uploadFile(buffer, fileName, type);
        console.log('AWS Response');
        console.log(data);
        return data;
      } catch (awsError) {
        uploadSuccess = false;
        console.log('AWS Error');
        console.log(awsError);
        return awsError;
      }
    });

    Promise.all(returnData).then((response) => {
      if (uploadSuccess) {
        return res.status(200).send(response);
      }
      return res.status(400).send(response);
    });
  });
};

// eslint-disable-next-line consistent-return
exports.getUploadURL = async (req, res) => {
  if (!req.user) {
    console.log('unauthorized user:');
    return res.status(401).send('You are not authorized');
  }
  let uploadSuccess = true;
  const files = req.body;
  const fileData = await files.map(async (file) => {
    const timestamp = Date.now().toString();
    const fileName = `proofOfServiceDocs/${timestamp}_${file.name}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${fileName}`,
      Expires: 3000,
      ContentType: file.type
    };

    const responseData = await new Promise((resolve, reject) => {
      s3.getSignedUrl('putObject', params, (err, url) => {
        console.log('The URL is', url);
        if (err) {
          uploadSuccess = false;
          reject(err);
        }
        const singleFileData = {
          url,
          fileName,
          type: file.type
        };
        resolve(singleFileData);
      });
    });
    return responseData;
  });
  Promise.all(fileData).then((response) => {
    console.log('responsedata');
    console.log(response);
    if (uploadSuccess) {
      return res.status(200).send(response);
    }
    return res.status(400).send(response);
  });
};

// code for the old way of doing file uploads
// const formData = new FormData();
// const {
//   request: { proofOfService }
// } = this.state;
// proofOfService.forEach((file) => {
//   formData.append('files', file);
// });
// const retData = await axios
//   .post(`${ApiUrl}upload`, formData, {
//     withCredentials: true,
//     mode: 'cors',
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
//   .then((res) => {
//     return res.data;
//   })
//   .catch(() => {
//     return false;
//   });
// return retData;
