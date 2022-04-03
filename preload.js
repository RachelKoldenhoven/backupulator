const { contextBridge } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('electron', {
  fs,
});
