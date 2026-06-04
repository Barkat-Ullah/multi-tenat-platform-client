const fs = require('fs');
const collection = JSON.parse(fs.readFileSync('Michele Fonai New.postman_collection.json', 'utf8'));

const endpoints = [];

function extractEndpoints(items, folderPath = '') {
  for (const item of items) {
    if (item.item) {
      extractEndpoints(item.item, folderPath ? `${folderPath} / ${item.name}` : item.name);
    } else if (item.request) {
      // It's a request
      const method = item.request.method;
      let path = '';
      if (item.request.url) {
        if (typeof item.request.url === 'string') {
           path = item.request.url;
        } else if (item.request.url.path) {
           path = '/' + item.request.url.path.join('/');
        } else if (item.request.url.raw) {
           path = item.request.url.raw.replace(/^{{baseUrl}}/, '');
        }
      }
      endpoints.push({
        folder: folderPath,
        name: item.name,
        method,
        path
      });
    }
  }
}

extractEndpoints(collection.item);
console.log(JSON.stringify(endpoints, null, 2));
