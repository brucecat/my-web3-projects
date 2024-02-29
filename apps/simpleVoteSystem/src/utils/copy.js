export function copyToClipboard(text, onOk, onFail) {
  // 使用 Clipboard API 复制文本
  navigator.clipboard.writeText(text)
      .then(function() {
          typeof onOk ==='function' && onOk()
      })
      .catch(function(err) {
          typeof onFail ==='function' && onFail(err)
      });
}
