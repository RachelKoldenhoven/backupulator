const { contextBridge } = require('electron');
const fs = require('fs');
const path = require("path");
const piexif = require('piexifjs');

const fsp = fs.promises;

const getBase64DataFromJpegFile = filename => fs.readFileSync(filename).toString('binary');
const getExifFromJpegFile = filename => piexif.load(getBase64DataFromJpegFile(filename));
const scan = async (directoryName, hashes, cb) => {
  let dir = await fsp.readdir(directoryName, {withFileTypes: true});
  for (const f of dir) {
    try {
      const fullPath = path.join(directoryName, f.name);
      const ext = path.extname(f.name).toLocaleLowerCase();
      if (f.isDirectory()) {
        await scan(fullPath, hashes, cb);
      } else if (['.jpg', '.jpeg'].includes(ext)) {
        const file = {
          name: f.name,
        }
        try {
          const exif = getExifFromJpegFile(fullPath);
          const imageUniqueId = exif.Exif[piexif.ExifIFD.ImageUniqueID]
          file.imageUniqueId = imageUniqueId;
          hashes[imageUniqueId] = hashes[imageUniqueId] || [];
          hashes[imageUniqueId].push(file);
          console.log(imageUniqueId)
        } catch (e) {
          console.error(`Error unpacking ${f.name}`, e)
        }
      }
    } catch(ex) {
      console.error(`Error on file ${f}`, ex);
    }
  }
  cb(hashes);
}

contextBridge.exposeInMainWorld('electron', {
  fsp,
  path,
  piexif,
  getExifFromJpegFile,
  scan,
});
