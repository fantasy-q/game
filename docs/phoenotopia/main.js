window.onload = () => {
  loadAndRenderYaml();
  loadAndRenderCSVs();
  performFontUpdate(); // 首次扫描
  setupObserver();     // 启动监听
};
