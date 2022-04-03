import Vue from './node_modules/vue/dist/vue.esm.browser.js';

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
    created() {
      this.files = window.electron.fs.readdirSync(
        '/Volumes/My Passport/Backup/Shared/Pictures'
      );
      console.log(this.files);
    },
  });
};
