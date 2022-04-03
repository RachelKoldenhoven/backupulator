const fs = require('fs');
const path = require("path");
const piexif = require('piexifjs');
// const { imageHash } = require('image-hash');
const fsp = fs.promises;

const hasher = new Worker('hasher.js');
hasher.postMessage([0, 1]);
console.log('Message posted to worker');

const imgHash = (path) => {
  return new Promise((res, rej) => {
    imageHash(path, 16, true, (error, data) => {
      if (error) rej(error);
      res(data);
    });
  })
}

const changeExif = async (fullPath) => {
  const exif = getExifFromJpegFile(fullPath);
  if(exif.Exif[piexif.ExifIFD.ImageUniqueID]) {
    console.log(`Skipping ${fullPath}`);
    return;
  }

  console.log(`Hashing ${fullPath}`);
  const hash = await imgHash(fullPath);
  exif.Exif[piexif.ExifIFD.ImageUniqueID] = hash;

  const newImageData = getBase64DataFromJpegFile(fullPath);
  const newExifBinary = piexif.dump(exif);
  const newPhotoData = piexif.insert(newExifBinary, newImageData);
  const fileBuffer = Buffer.from(newPhotoData, 'binary');
  fs.writeFileSync(fullPath, fileBuffer);
};

const getBase64DataFromJpegFile = filename => fs.readFileSync(filename).toString('binary');
const getExifFromJpegFile = filename => piexif.load(getBase64DataFromJpegFile(filename));

window.electron = {
  fsp,
  path,
  piexif,
  getExifFromJpegFile,
}
