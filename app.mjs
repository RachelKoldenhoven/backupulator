import Vue from './node_modules/vue/dist/vue.esm.browser.js';

const root = '/Volumes/My Passport/Backup/Shared/Pictures';

onload = () => {
  const app = new Vue({
    el: '#app',
    template: `<div>
      <ol>
        <li v-for="file in files">{{ file }}</li>
      </ol>
    </div>`,
    data: {
      files: [],
    },
    async created() {
      this.files = await window.electron.fs.readdir(root);
      console.log(this.files);
    },
  });
};
