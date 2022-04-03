const { contextBridge } = require('electron');
const fs = require('fs').promises;
const path = require("path");

contextBridge.exposeInMainWorld('electron', {
  fs,
  path,
});
