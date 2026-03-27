const fs = require('fs');
const path = require('path');
const dirs = [
  './src/App.vue',
  './src/views/HomeView.vue',
  './src/views/CityDetailView.vue',
  './src/components/ContentCard.vue',
  './src/components/HostCard.vue',
  './src/components/HostDrawer.vue',
  './src/api/city.js'
];

dirs.forEach(file => {
  const fullPath = path.resolve(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/accent-red/g, 'china-red');
    content = content.replace(/ink-base/g, 'ink-black');
    content = content.replace(/A33B39/g, 'C83C23'); // china-red hex update for echarts
    content = content.replace(/1A1C20/g, '1E1E1E'); // ink-black hex update for echarts
    fs.writeFileSync(fullPath, content, 'utf8');
  }
});
console.log('Colors replaced successfully!');
