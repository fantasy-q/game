import './script/yml.js';
import './script/csv.js';
import './script/font.js';

console.log("main.js");
const ymlFile = 'content';
const csvFiles = ['heart', 'oxygen', 'moon'];

loadAndRenderYaml(ymlFile, './data');
loadAndRenderCSVs(csvFiles, './data');
performFontUpdate(); // 首次扫描
setupObserver();     // 启动监听
