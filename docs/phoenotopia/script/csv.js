/**
 * 1. 工具函数提取到外部 (遵循垂直邻近性原则与单一职责原则)
 * 
 */
const buildBiliUrl = (part, time) =>
  `https://www.bilibili.com/video/BV1V2vvBrEPU/?p=${part}&t=${time}`;

const createRowNode = ({ type, part, time, code, hint }) => {
  const p = document.createElement('p');
  p.className = 'area-row';

  const a = document.createElement('a');
  Object.assign(a, {
    className: type,
    href: buildBiliUrl(part, time),
    target: "_blank",
    textContent: code
  });

  const span = document.createElement('span');
  span.className = "hint";
  span.textContent = hint;

  p.append(a, span);
  return p;
};

/**
 * 2. 通用的读取函数
 * 
 */
async function readCSV(file) {
  const url = `data/${file}.csv`;
  try {
    const response = await fetch(url);
    const csvString = await response.text();
    return { type: file, data: d3.csvParse(csvString) }
  }
  catch {
    console.error("CSV 解析失败，请检查格式:", error);
    throw error;
  }
}
/**
 * 3. 主逻辑优化
 */
async function loadAndRenderCSVs() {
  const files = ['heart', 'oxygen', 'moon'];

  try {
    // 使用 allSettled 提升容错性，单个文件失败不会中断全局渲染 
    const results = await Promise.allSettled(files.map(readCSV));

    // 使用 Map 替代 Object，优化增删性能并防止隐藏类失效 [5]
    const areaGroups = new Map();

    // 单次迭代处理：过滤、注入与分组合并，避免中间数组产生的 GC 压力 
    for (const result of results) {
      if (result.status !== 'fulfilled') {
        console.warn(`文件加载失败:`, result.reason);
        continue;
      }

      const { type, data } = result.value;
      if (!data) continue;

      for (const row of data) {
        if (!row.area) continue;

        if (!areaGroups.has(row.area)) {
          areaGroups.set(row.area, document.createDocumentFragment());
        }

        // 将 DOM 节点预先挂载到 DocumentFragment 中 [7]
        areaGroups.get(row.area).append(createRowNode({ ...row, type }));
      }
    }

    // 4. 批量渲染逻辑：减少 DOM 查询与重排 [7, 8]
    // 建议：如果 rb 标签较多，可考虑给 h3 增加统一的 class 如.area-title
    document.querySelectorAll('h3.area rb').forEach(rb => {
      const areaName = rb.textContent.trim();
      const fragment = areaGroups.get(areaName);

      if (fragment) {
        const wrapper = document.createElement('div');
        wrapper.className = "area-content-wrapper";
        wrapper.append(fragment); // 内存碎片一次性进入真实 DOM [9]

        rb.closest('h3').insertAdjacentElement('afterend', wrapper);

        // 使用 Map.delete 进行高效内存回收 [10]
        areaGroups.delete(areaName);
      }
    });

  } catch (criticalError) {
    console.error("系统级核心错误:", criticalError);
  }
}
