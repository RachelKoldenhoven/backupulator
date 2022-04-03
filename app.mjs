import Vue from './node_modules/vue/dist/vue.esm.browser.js';

const root = '/Volumes/My Passport/Backup/Shared/Pictures';

onload = () => {
    const app = new Vue({
        el: '#app',
        template: `
          <div>
          <ol>
            <li v-for="file in files">{{ file.name }}</li>
          </ol>
          </div>`,
        data: {
            files: [],
        },
        async created() {
            const files = await window.electron.fs.readdir(root, {withFileTypes: true})
            this.files = files
                .filter((f) => {
                    const fullPath = electron.path.join(root, f.name);
                    const ext = electron.path.extname(f.name).toLocaleLowerCase();
                    return ext === '.jpg' || ext === '.jpeg'
                })
            console.log(this.files);
        },
    });
};
