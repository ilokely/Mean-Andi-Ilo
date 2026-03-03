const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

cloudinary.config({
    cloud_name: "djwpyvt75",
    api_key: "197296814983997",
    api_secret: "4-fsd_GF16x0DbeGTkdFDroYayk"
});

module.exports = cloudinary;