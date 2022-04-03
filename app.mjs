import Vue from './node_modules/vue/dist/vue.esm.browser.js';

onload = () => {
  const app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
    },
  });
};
