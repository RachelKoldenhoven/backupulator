const { contextBridge } = require('electron');
const fs = require('fs');
const path = require("path");
const piexif = require('piexifjs');

const fsp = fs.promises;

const getBase64DataFromJpegFile = filename => fs.readFileSync(filename).toString('binary');
const getExifFromJpegFile = filename => piexif.load(getBase64DataFromJpegFile(filename));

contextBridge.exposeInMainWorld('electron', {
  fsp,
  path,
  piexif,
  getExifFromJpegFile,
});
