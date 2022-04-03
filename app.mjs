import Vue from './node_modules/vue/dist/vue.esm.browser.js';

const root = '/Volumes/My Passport/Backup/Shared/Pictures';

onload = () => {
    const app = new Vue({
        el: '#app',
        template: `
          <div>
          <ol>
            <li v-for="file in files">{{ file.name }} {{ file.imageUniqueId }}</li>
          </ol>
          </div>`,
        data: {
            files: [],
        },
        async created() {
            const files = await window.electron.fsp.readdir(root, {withFileTypes: true})
            this.files = files
                .filter((f) => {
                    const ext = electron.path.extname(f.name).toLocaleLowerCase();
                    return ext === '.jpg' || ext === '.jpeg'
                }).map((f) => {
                    const fullPath = electron.path.join(root, f.name);
                    const file = {
                        name: f.name,
                    }
                    try {
                        const exif = electron.getExifFromJpegFile(fullPath);
                        const imageUniqueId = exif.Exif[electron.piexif.ExifIFD.ImageUniqueID]
                        file.imageUniqueId = imageUniqueId;
                    } catch (e) {
                        console.error(`Error unpacking ${f.name}`, e)
                    }
                    return file;
                })
            console.log(this.files);
        },
    });
};
