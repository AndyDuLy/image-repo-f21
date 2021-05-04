require("dotenv").config();

const aws = require('aws-sdk');
const fs = require('fs');

// AWS Secrets Config
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
})

const s3 = new aws.S3();

// S3 Helper to Facilitate Uploading Image(s)
const uploadImage = async (req, uuid) => {
  const { userID } = req.body;

  var params = {
    ACL: 'public-read-write',
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fs.createReadStream(req.file.path),
    Key: `${userID}/${uuid}_${req.file.originalname}`
  };

  const imageURL = await s3.upload(params).promise();
  
  return {
    imageURL: imageURL.Location,
    imageKey: `${uuid}_${req.file.originalname}`,
    imageID: uuid
  };
}

// S3 Helper to Facilitate Deleting Image(s)
const deleteImage = async (req, imageKey) => {
  const { userID } = req.body;

  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userID}/${imageKey}`
  };

  try {
    await s3.headObject(params).promise();
    const temp = await s3.deleteObject(params).promise();

    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { uploadImage, deleteImage };
