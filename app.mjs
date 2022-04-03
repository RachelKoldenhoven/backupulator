import Vue from './node_modules/vue/dist/vue.esm.browser.js';

const root = '/Volumes/BACKUPA/Backup/Shared/Pictures';

onload = () => {
    const app = new Vue({
        el: '#app',
        template: `
          <div>
          <ol>
            <li v-for="hash in Object.keys(hashes)">{{ hash }} count={{ hashes[hash].length }}</li>
          </ol>
          </div>`,
        data: {
            hashes: {
                'test': []
            },
        },
        async created() {
            this.hashes = {}
            electron.scan(root, this.hashes, (hashes) => this.hashes = hashes);
        },
    });
};
