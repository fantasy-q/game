import { BILI_BASE_URL, CONTENTS, HEADINGS, FOOTER } from './data/content.js';
// import tocbot from 'tocbot';
const { createApp, ref, onMounted, onUnmounted } = Vue;

console.log(CONTENTS);
console.log(tocbot);

createApp({
  setup() {
    // 响应式数据
    const contents = ref(CONTENTS);
    const headings = ref(HEADINGS);
    const footer = ref(FOOTER);
    const anchor = (p, t) => `${BILI_BASE_URL}?p=${p ?? 1}&t=${t ?? 0}`;
    const getPrefixClass = (str) => {
      const map = { OXY: 'oxygen', HEART: 'heart', MOON: 'moon' };
      const prefix = str?.split('_')[0];
      return map[prefix] || '';
    };

    onMounted(() => {
      addGoogleFont();
      tocbot.init({
        tocSelector: '.tocbot', // 目录渲染的容器类名
        contentSelector: '#app', // 文章内容的容器
        headingSelector: 'h2, h3', // 要抓取的标题
        scrollSmooth: true, // 平滑滚动
        collapseDepth: 6,
        headingsOffset: 40,
        scrollSmoothOffset: -40,
        // 每次目录刷新后执行
        onRenderCSSClasses: function (nodes) {
          // 可以在这里手动给特定的 nodes 加上图标类名
          // console.debug(nodes);
        },
        // 标题被抓取后的过滤逻辑
        headingObjectCallback: (obj, el) => {
          // obj 是 Tocbot 生成的对象，el 是原始 DOM 元素
          // 你可以在这里修改 obj.textContent 或者增加属性
          // console.debug(obj);
          // console.debug(el);
          obj.textContent = obj.id;
          return obj;
        },
      });
    });

    onUnmounted(() => {
      tocbot.destroy(); // 组件销毁时释放内存
    });

    // 暴露给模板
    return { contents, headings, footer, anchor, getPrefixClass };
  },
}).mount('#app');

function addGoogleFont() {
  // 2. 提取所有字符并去重 (包括中文、英文、数字和标点)
  const allChars = JSON.stringify(CONTENTS);
  const uniqueChars = Array.from(new Set(allChars)).join('');
  console.debug(uniqueChars);

  // 3. 对字符进行 URL 编码
  const encodedText = encodeURIComponent(uniqueChars);

  // 4. 构建 Google Fonts 复合链接
  const baseUrl = 'https://fonts.googleapis.com/css2';
  const families = ['Noto+Sans+SC', 'Noto+Serif+SC', 'Montserrat']
    .map((f) => `family=${f}`)
    .join('&');

  const finalUrl = `${baseUrl}?${families}&text=${encodedText}&display=swap`;

  // 5. 插入到页面中
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = finalUrl;
  document.head.appendChild(link);
}
