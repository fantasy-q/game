let globalCharSet = new Set();
let fontUpdateTimer = null;
let lastUrl = "";

async function performFontUpdate() {
  // 1. 抓取页面文本
  const allText = document.body.innerText;
  const uniqueChars = [...new Set(allText.replace(/\s/g, ''))].sort().join('');

  if (uniqueChars.length === 0) return;
  console.debug(uniqueChars);

  // 2. 定义需要引入的字体列表
  const families = [
    "Noto+Sans+SC",
    "Noto+Serif+SC",
    // "Noto+Serif+SC:wght@700;900",
    "Montserrat"
  ];

  // 3. 构造复合请求链接
  // 格式: family=Font1&family=Font2&text=Chars
  const baseUrl = "https://fonts.googleapis.com/css2";
  const familyQuery = families.map(f => `family=${f}`).join('&');
  const encodedChars = `text=${encodeURIComponent(uniqueChars)}`;
  const fontUrl = `${baseUrl}?${familyQuery}&${encodedChars}&display=swap`;

  try {
    const response = await fetch(fontUrl);
    let cssText = await response.text();

    let styleTag = document.getElementById('dynamic-injected-fonts');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-injected-fonts';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = cssText;
  } catch (err) {
    console.error("字体加载失败:", err);
    document.body.classList.add('fonts-loaded'); // 失败也显示，使用兜底字体
  }
}

function triggerFontSync() {
  if (fontUpdateTimer) clearTimeout(fontUpdateTimer);
  fontUpdateTimer = setTimeout(performFontUpdate, 500); // 500ms 内没有新变化才请求
}

function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        shouldUpdate = true;
      }
    });
    if (shouldUpdate) triggerFontSync();
  });

  // 监听整个 body，包括子节点变化、文本内容变化、所有后代
  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true
  });
}

window.performFontUpdate = performFontUpdate;
window.setupObserver = setupObserver;
