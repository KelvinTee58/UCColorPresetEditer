import { v4 as uuidv4, validate } from "uuid";
import { gap, border, fill, size, axis, fontStyle, uucObject, uucFontObject, uucImageObject } from "./uuc_interface";

class uucBlock implements uucObject {
  id: string;
  type: string;
  label: string;
  // gap: gap;
  level: number;
  axis: axis;
  // width: number;
  // height: number;
  size: size;

  // 可选
  round?: number;
  // background?: string;
  border?: border;
  padding?: gap;
  angle?: number;
  fill?: fill;

  constructor(object: uucObject) {
    // 自身属性
    this.id = validate(object.id) ? object.id : uuidv4();
    this.type = "block";

    // 配置属性
    this.label = object.label;
    this.level = object.level;
    this.axis = object.axis;

    this.size = object.size;
    // this.width = object.width ? object.width : 10;
    // this.height = object.height ? object.height : 10;
    this.size.width = object.size.width ? object.size.width : 10;
    this.size.height = object.size.height ? object.size.height : 10;
    // lockAspectRatio 默认值是true
    this.size["lockAspectRatio"] = object.size["lockAspectRatio"] !== undefined ? object.size["lockAspectRatio"] : true;

    // 可选属性
    this.angle = object.angle;
    this.round = object.round;
    // this.background = object.background;
    this.border = object.border;
    this.padding = object.padding;
    this.fill = object.fill;
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
