// 随机切换
function randomSelection(obj) {
  return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
}

/**
 * 下载图片
 * @param blob 图片二进制数据
 */
function downloadBlobToPng(blob) {
  const anchor = document.createElement('a');
  const url = window.URL.createObjectURL(blob);

  anchor.href = url;
  anchor.download = 'live2d.png';
  anchor.click();

  URL.revokeObjectURL(url);
}

export { randomSelection, downloadBlobToPng };
