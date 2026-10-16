// Shared contact entry, independent of the product catalog loading successfully.
(() => {
  const dialog = document.getElementById('wechatContact');
  if (!dialog) return;
  document.addEventListener('click', event => {
    if (event.target.closest('[data-wechat-open]')) dialog.showModal();
  });
  dialog.querySelector('[data-wechat-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
})();
