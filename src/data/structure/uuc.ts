// uuc.ts
import { v4 as uuidv4, validate } from "uuid";
import { Gap, Border, Fill, Size, Axis, FontStyle, UucObject, UucFontObject, UucImageObject } from "./uuc_interface";

/**
 * 基础块类，实现了基础对象接口
 */
class UucBlock implements UucObject {
  id: string;
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

  // 额外的配置信息
  uuConfig: Object;

  /**
   * 构造函数，初始化块对象
   * @param object 基础对象接口实例
   */
  constructor(object: UucObject) {
    this.id = validate(object.id) ? object.id : uuidv4();
    this.type = "block";
    this.label = object.label;
    this.level = object.level;
    this.axis = object.axis;
    this.size = {
      width: object.size.width ?? 10,
      height: object.size.height ?? 10,
      lockAspectRatio: object.size.lockAspectRatio ?? true,
    };
    this.round = object.round;
    this.border = object.border;
    this.padding = object.padding;
    this.angle = object.angle ?? 0;
    this.fill = object.fill;

    // 配置逻辑
    this.uuConfig = {
      lock: false,
    };
  }
}

/**
 * 字体块类，继承自基础块类，并实现了字体对象接口
 */
class UucFont extends UucBlock implements UucFontObject {
  font: FontStyle;

  /**
   * 构造函数，初始化字体块对象
   * @param object 字体对象接口实例
   */
  constructor(object: UucFontObject) {
    super(object);
    this.font = object.font;
    this.type = "font";
  }
}

/**
 * 图像块类，继承自基础块类，并实现了图像对象接口
 */
class UucImage extends UucBlock implements UucImageObject {
  src: string;

  /**
   * 构造函数，初始化图像块对象
   * @param object 图像对象接口实例
   */
  constructor(object: UucImageObject) {
    super(object);
    this.src = object.src;
    this.type = "image";
  }
}

export { UucBlock, UucFont, UucImage };
