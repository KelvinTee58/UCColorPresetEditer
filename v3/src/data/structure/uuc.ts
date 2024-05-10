import { v4 as uuidv4, validate } from "uuid";
import { gap, border, axis, fontStyle, uucObject, uucFontObject, uucImageObject } from "./uuc_interface";

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
    this.id = validate(object.id) ? object.id : uuidv4();
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
