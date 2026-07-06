// ECharts/zrender 在 wheel/mousewheel 事件上未设置 passive 选项
// 导致浏览器抛出 [Violation] 警告。在监听器前 patch 掉。
// https://chromestatus.com/feature/5745543795965952

if (typeof window !== "undefined") {
  const original = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) {
    let opts: AddEventListenerOptions | boolean | undefined = options;
    if (type === "mousewheel" || type === "wheel") {
      if (typeof options === "object" && options !== null) {
        opts = { ...options, passive: true, capture: true };
      } else {
        opts = { passive: true, capture: true };
      }
    }
    return original.call(this, type, listener, opts);
  };
}
