export const filters = {
  // 解决快捷键适配win和macos 问题
  getUserAgentCtrlShortcutKey: (key: string | any) => {
    let ctrlKey = "⌘";
    const userAgent: any = navigator.userAgent || navigator.vendor;

    if (/mac/i.test(userAgent)) {
      ctrlKey = "⌘ ";
    } else if (/win/i.test(userAgent)) {
      ctrlKey = "Ctrl+";
    }
    return ctrlKey + key;
  },
};
