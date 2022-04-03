const fs = require('fs');
const path = require("path");
const piexif = require('piexifjs');
const imageHash = require('node-image-hash');
const fsp = fs.promises;

const getBase64DataFromJpegFile = filename => fs.readFileSync(filename).toString('binary');
const getExifFromJpegFile = filename => piexif.load(getBase64DataFromJpegFile(filename));

window.electron = {
  fsp,
  path,
  piexif,
  getExifFromJpegFile,
  getBase64DataFromJpegFile,
  imageHash,
}
