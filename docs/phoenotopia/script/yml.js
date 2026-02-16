/**
 * 1. 抽离小组件函数 (提高可读性与复用性)
 * 使用真正的 <ruby> 标签替代 span，保持语义统一
 */
const createRubyNode = (rbText, rtText) => {
  const ruby = document.createElement('ruby');
  // 直接设置 textContent，HTML5 中 ruby 内部的文本节点即视为 rb

  const rb = document.createElement('rb');
  const rt = document.createElement('rt');
  rb.textContent = rbText;
  rt.textContent = rtText;

  ruby.appendChild(rb);
  ruby.appendChild(rt);
  return ruby;
};

const createHeading = (level, item, className = "") => {
  const h = document.createElement(`h${level}`);
  if (className) h.className = className;
  h.appendChild(createRubyNode(item.rb, item.rt));
  return h;
};

const createLink = (row) => {
  const { text, href } = row;
  const a = document.createElement("a");
  Object.assign(a, {
    href: href,
    target: "_blank",
    textContent: text
  });
  return a;
};
/**
 * 2. 主渲染逻辑
 */
async function loadAndRenderYaml() {
  const filename = 'data/content.yml';
  const main = document.getElementById('main');
  const footer = document.getElementById('footer');

  try {
    const response = await fetch(filename);
    if (!response.ok) throw new Error(`网络请求失败: ${response.status}`);

    const yamlText = await response.text();
    const doc = jsyaml.load(yamlText);

    // 判空保护：确保数据结构符合预期
    if (!doc || !Array.isArray(doc.main)) {
      throw new Error('YAML 数据格式错误：缺少 main 节点');
    }

    const fragment = document.createDocumentFragment();
    doc.main.forEach(section => {
      const items = section.h3;
      // 使用防御性编程处理空数据
      if (!Array.isArray(items) || items.length === 0) return;
      fragment.appendChild(createHeading(2, items[0]));
      items.forEach((item, i) => {
        fragment.appendChild(createHeading(3, item, "area"));
      });
    });
    main.appendChild(fragment);

    doc.footer.flatMap(({ a }) => a)
      .map(createLink).forEach(a => footer.appendChild(a))



  } catch (error) {
    // 改进错误反馈机制
    main.innerHTML = `<p class="error">渲染失败: ${error.message}</p>`;
    console.error("YAML 渲染出错:", error);
  }
}