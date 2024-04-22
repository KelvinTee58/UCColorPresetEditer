import { v4 as uuidv4 } from "uuid";
interface gap {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
interface border {
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

interface axis {
  x: number;
  y: number;
}

interface fontStyle {
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

interface uucObject {
  readonly id: string;
  type: string;
  label: string;
  level: number;
  width: number;
  height: number;
  axis: axis;

  round?: number;
  background?: string;
  border?: border;
  padding?: gap;
}

interface uucFontObject extends uucObject {
  font: fontStyle;
}

interface uucImageObject extends uucObject {
  src: string;
}

// interface uucBlockObject extends uucObject {
//   // src: string;
// }

class uucBlock implements uucObject {
  id: string;
  type: string;
  label: string;
  // gap: gap;
  level: number;
  axis: axis;
  width: number;
  height: number;

  round?: number;
  background?: string;
  border?: border;
  padding?: gap;

  constructor(object: uucObject) {
    // 自身属性
    this.id = uuidv4();
    this.type = "block";

    // 配置属性
    this.label = object.label;
    this.level = object.level;
    this.axis = object.axis;
    this.width = object.width ? object.width : 10;
    this.height = object.height ? object.height : 10;

    // 可选属性
    this.round = object.round;
    this.background = object.background;
    this.border = object.border;
    this.padding = object.padding;
  }
}

class uucFont extends uucBlock implements uucFontObject {
  font: fontStyle;
  constructor(object: uucFontObject) {
    super(object);
    this.font = object.font;

    this.type = "font";
  }
}

class uucImage extends uucBlock implements uucImageObject {
  src: string;
  constructor(object: uucImageObject) {
    super(object);
    this.src = object.src;

    this.type = "image";
  }
}

export { uucBlock, uucFont, uucImage };
