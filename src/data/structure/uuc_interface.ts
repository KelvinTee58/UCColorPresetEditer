export interface MyObject {
  [key: string]: unknown;
}

export interface gap {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
// 边类型
export interface border {
  width: number;
  color: string;

  // # style
  // none	无边框
  // hidden	隐藏边框，与 "none" 类似
  // dotted	定义点状虚线边框
  // dashed	定义虚线边框
  // solid	定义实线边框
  // double	定义双实线边框，双实线边框的宽度等于 border-width 的值
  style: string;
}

// 坐标轴
export interface axis {
  x: number;
  y: number;
}

// 内容填充
export type fillMode = "none" | "gradient" | "solid";
export interface fill {
  mode: fillMode;
  color: string;
}

export interface fontStyle {
  size: number;
  color: string;
  family: string;
  familyName: string;
  style: string;

  // # style
  // normal	默认值，文本以正常字体显示
  // italic	文本以斜体显示
  // oblique	文本倾斜显示
  // inherit	从父元素继承字体样式

  weight: string;
  // # weight
  // normal	默认值，标准字体
  // bold	粗体字体
  // bolder	更粗的字体
  // lighter	更细的字体
}

export interface uucObject {
  readonly id: string;
  type: string;
  label: string;
  level: number;
  width: number;
  height: number;
  axis: axis;

  round?: number;
  // background?: string;
  border?: border;
  padding?: gap;
  angle?: number;
  fill?: fill;
}

export interface uucFontObject extends uucObject {
  font: fontStyle;
}

export interface uucImageObject extends uucObject {
  src: string;
}
