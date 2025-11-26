const fs = require('fs');
const path = require('path');

/**
 * Deletes an image file from the server.
 * @param {String} imageUrl - The full image URL stored in DB.
 */
const deleteImage = (imageUrl) => {
    if (!imageUrl) return;

    const imageName = path.basename(imageUrl); // get filename from URL
    const imagePath = path.resolve(`public/${imageUrl}`);
    console.log(imagePath)

    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("❌ Failed to delete image:", imagePath, err.message);
            } else {
                console.log("🗑️ Deleted image:", imageName);
            }
        });
    }
};

module.exports = { deleteImage };
