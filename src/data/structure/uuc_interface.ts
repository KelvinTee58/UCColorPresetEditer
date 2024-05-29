/**
 * 通用对象接口，键值对形式
 */
export interface MyObject {
  [key: string]: unknown;
}

/**
 * 间距接口，定义了上、右、下、左四个方向的间距
 */
export interface Gap {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * 边框样式类型
 */
export type BorderStyle = "none" | "dotted" | "dashed" | "solid" | "double";

/**
 * 边框接口，定义了边框的宽度、颜色和样式
 */
export interface Border {
  width: number;
  color: string;

  style: BorderStyle | string;
}

/**
 * 坐标轴接口，定义了x和y坐标
 */
export interface Axis {
  x: number;
  y: number;
}

/**
 * 尺寸接口，定义了宽度、高度和锁定宽高比
 */
export interface Size {
  width: number;
  height: number;
  lockAspectRatio: boolean;
}

/**
 * 填充模式类型
 */
export type FillMode = "none" | "gradient" | "solid";

/**
 * 填充接口，定义了填充模式和颜色
 */
export interface Fill {
  mode: FillMode;
  color: string;
}

/**
 * 字体样式接口，定义了字体的大小、颜色、家族、样式和粗细
 */
export interface FontStyle {
  size: number;
  color: string;
  family: string;
  familyName: string;
  style: string;
  weight: string;
}

/**
 * 基础对象接口，定义了基本属性如id、类型、标签、级别、坐标、尺寸等
 */
export interface UucObject {
  readonly id: string;
  type: string;
  label: string;
  level: number;
  axis: Axis;
  size: Size;
  round?: number;
  border?: Border;
  padding?: Gap;
  angle?: number;
  fill?: Fill;
}

/**
 * 字体对象接口，继承自基础对象接口，并添加了字体样式属性
 */
export interface UucFontObject extends UucObject {
  font: FontStyle;
}

/**
 * 图像对象接口，继承自基础对象接口，并添加了图像源属性
 */
export interface UucImageObject extends UucObject {
  src: string;
}
