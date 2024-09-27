const fs = require("fs").promises; // Using the promises API for better async control
const sharp = require("sharp");


// Utility function to add a delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to retry an operation a few times before throwing an error
const retryAsyncOperation = async (operation, retries = 3, delayTime = 500) => {
  while (retries > 0) {
    try {
      return await operation();
    } catch (err) {
      if (err.code === 'EPERM' && retries > 0) {
        retries -= 1;
        console.log(`Retrying... attempts left: ${retries}`);
        await delay(delayTime);
      } else {
        throw err;
      }
    }
  }
};

const compressImage = async (filePath) => {
  const tempFilePath = filePath.replace(/(\.[\w\d_-]+)$/i, "-compressed$1");

  try {
    // Compress the image and save it with a temporary name
    await sharp(filePath)
      .resize({ width: 800 }) // Resize the image (optional)
      .jpeg({ quality: 80 })  // Adjust quality for JPEG
      .toFile(tempFilePath);

    // Retry unlinking the original file in case of EPERM error
    await retryAsyncOperation(() => fs.unlink(filePath));

    // Rename the compressed image to the original filename
    await fs.rename(tempFilePath, filePath);

    console.log("Image compressed and renamed successfully");
  } catch (err) {
    console.error("Error while compressing image:", err);
    throw err; // Re-throw the error to handle it in the calling code
  }
};

module.exports = {compressImage}