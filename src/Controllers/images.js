require("dotenv").config();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
var path = require('path')

const User = require("../Models/user");
const { uploadImage, deleteImage } = require('./s3');

// POST Callback to Facilitate Image Upload and MongoDB Atlas Write
const CREATE = async (req, res) => {
  const acceptableFileTypes = [ ".png", ".jpg", ".jpeg", ".gif" ];
  const fileExtension = path.extname(req.file.originalname);

  if (!acceptableFileTypes.includes(fileExtension)) return res.status(415).json({ error: "Inputted file is not an accepted image type" });
  if (!req.body.userID) return res.status(400).json({ error: "Missing required parameter(s)" });

  try {
    const { userID } = req.body;
    const uuid = uuidv4();
    const query = { _id : userID };

    const s3Data = await uploadImage(req, uuid);

    fs.unlinkSync(req.file.path);

    const updateDocument = {
      $push: {
        images: {
          id: uuid,
          image_url: s3Data.imageURL,
          image_key: s3Data.imageKey,
          imageID: s3Data.imageID
        }
      }
    };

    await User.updateOne(query, updateDocument);

    res.status(201).send({
      message: "Image Uploaded Successfully",
      image_url: s3Data.imageURL,
      image_key: s3Data.imageKey,
      imageID: s3Data.imageID
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// GET Callback to Facilitate Retrieving Image(s) Collection 
const READ = async (req, res) => {
  try {
    const { userID } = req.body;

    await User.findOne({ _id : userID }).then((currentUser) => {
      res.status(200).json(currentUser.images);
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// DELETE Callback to Facilitate Deleting Specific Image(s)
const DELETE = async (req, res) => {
  if (!req.body.userID) return res.status(400).json({ error: "Missing required parameter(s)" });

  try {
    const { imageID, imageKey, userID } = req.body;
    const query = { _id : userID, "images.id" : imageID };

    const exists = await deleteImage(req, imageKey);

    if (!exists) return res.status(404).json({ error: "File does not exist" });

    const updateDocument = { 
      $pull: {
        images: {
          id : imageID
        }
      }
    };

    await User.updateOne(query, updateDocument);

    res.status(200).send({
      message: "Image deleted successfully"
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = { CREATE, READ, DELETE };
