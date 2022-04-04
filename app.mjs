import Vue from './node_modules/vue/dist/vue.esm.browser.js';
import Dedupe from './components/dedupe.mjs';

const root = '/Volumes/BACKUPA/Backup/Shared/Pictures';

const changeExif = async (fullPath) => {
  const exif = electron.getExifFromJpegFile(fullPath);
  const existingHash = exif.Exif[electron.piexif.ExifIFD.ImageUniqueID];
  if (existingHash && existingHash.startsWith('bkpv0-')) {
    console.log(`Skipping ${fullPath}`);
    return;
  }

  console.log(`Hashing ${fullPath}`);
  const hash = await electron.imageHash.hash(fullPath, 8, 'hex');
  exif.Exif[electron.piexif.ExifIFD.ImageUniqueID] = `bkpv0-${hash.hash}`;

  const newImageData = electron.getBase64DataFromJpegFile(fullPath);
  const newExifBinary = electron.piexif.dump(exif);
  const newPhotoData = electron.piexif.insert(newExifBinary, newImageData);
  const fileBuffer = Buffer.from(newPhotoData, 'binary');
  await electron.fsp.writeFile(fullPath, fileBuffer);
};

const scan = async (directoryName, hashes, cb) => {
  let dir = await electron.fsp.readdir(directoryName, { withFileTypes: true });
  for (const f of dir) {
    try {
      const fullPath = electron.path.join(directoryName, f.name);
      const ext = electron.path.extname(f.name).toLocaleLowerCase();
      if (f.isDirectory()) {
        await scan(fullPath, hashes, cb);
      } else if (['.jpg', '.jpeg'].includes(ext)) {
        await changeExif(fullPath);

        const file = {
          name: f.name,
          path: fullPath,
        };
        try {
          const exif = electron.getExifFromJpegFile(fullPath);
          const imageUniqueId =
            exif.Exif[electron.piexif.ExifIFD.ImageUniqueID];
          file.imageUniqueId = imageUniqueId;
          hashes[imageUniqueId] = hashes[imageUniqueId] || [];
          hashes[imageUniqueId].push(file);
          cb(hashes, fullPath);
        } catch (e) {
          console.error(`Error unpacking ${f.name}`, e);
        }
      }
    } catch (ex) {
      console.error(`Error on file ${f}`, ex);
    }
  }
};

onload = () => {
  const app = new Vue({
    el: '#app',
    components: {
      dedupe: Dedupe,
    },
    template: `
          <div>
          <dedupe/>
          {{ path }}
          <ol>
            <li v-for="hash in Object.keys(hashes).filter(hash => hashes[hash].length > 1)">
              {{ hash }}
            <span v-for="file in hashes[hash]">
              {{ file.path }}
              <!--img :src="'file://' + file.path"/-->
            </span>
            </li>
          </ol>
          </div>`,
    data() {
      return {
        path: '',
        hashes: {
          test: [],
        },
      };
    },
    async created() {
      this.hashes = {};
      scan(root, this.hashes, (hashes, path) => {
        this.hashes = hashes;
        this.path = path;
        this.$forceUpdate();
      });
    },
  });
};
