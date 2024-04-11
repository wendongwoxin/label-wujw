import { fabric } from "fabric";

type Params = {
  id: string;
  url: string;
};

export type LabelType = "point" | "rect" | "polygon" | "circle";
class LabelInit {
  canvas!: fabric.Canvas;
  image!: fabric.Image;
  width!: number;
  height!: number;
  private isLabeling = false;
  private labelType: LabelType | undefined;
  private rect: fabric.Rect | undefined;
  constructor(params: Params) {
    const { id, url } = params;
    const dom = document.getElementById(id);
    if (dom instanceof HTMLCanvasElement) {
      this.width = dom.width;
      this.height = dom.height;
      this.canvas = new fabric.Canvas(id);
      this.renderImage(url);
      this.bindRightClick();
    } else {
      console.error("Canvas element not found");
    }
  }

  // 图片加载
  renderImage(url: string) {
    fabric.Image.fromURL(url, (img: fabric.Image) => {
      img.hoverCursor = "default";
      this.image = img;
      this.canvas.add(img);
      if (img.width && img.height)
        img.set({
          left: 0,
          top: 0,
          hasControls: false,
          scaleX: this.width / img.width,
          scaleY: this.height / img.height,
          selectable: false,
        });
      this.bindEvents();
    });
  }
  // 绑定事件
  bindEvents() {
    this.image.on("mousedown", (_options) => {
      if (this.labelType) {
        switch (this.labelType) {
          case "point":
            this.addPoint(_options);
            break;
          case "rect":
            this.addRect(_options, true);
            break;
          case "polygon":
            this.addPolygon(_options);
            break;
          case "circle":
            this.addCircle(_options);
        }
      }
    });

    this.image.on("mousemove", (_options) => {
      if (this.labelType) {
        switch (this.labelType) {
          case "rect":
            this.addRect(_options, false);
            break;
          case "polygon":
            this.addPolygon(_options);
            break;
          case "circle":
            this.addCircle(_options);
            break;
        }
      }
    });
  }
  // 绑定右键点击事件
  bindRightClick() {
    // 获取 canvas 的 DOM 元素
    const canvasElement = (this.canvas as any).upperCanvasEl;

    // 绑定原生的 contextmenu 事件（即右键点击事件）
    canvasElement.addEventListener("contextmenu", (event: Event) => {
      // 阻止默认的右键菜单显示
      event.preventDefault();

      // 获取点击位置的坐标（需要转换为 Fabric.js 的坐标系统）
      const pointer = this.canvas.getPointer(event);
      const x = pointer.x;
      const y = pointer.y;

      // 在此处可以添加更多逻辑，比如创建一个对象或者进行其他操作
      console.log("Right-click detected at:", x, y);
      if (this.isLabeling && this.rect) {
        this.rect.set({
          width: x - this.rect.left!,
          height: y - this.rect.top!,
        });
        this.canvas.renderAll();
        this.rect = undefined;
        this.isLabeling = false;
      } else {
        const objects = this.findObjects(x, y);
        console.log(objects);
      }
    });
  }
  // 点击的对象集合
  findObjects(x: number, y: number) {
    const objects: fabric.Object[] = [];
    this.canvas.forEachObject((object) => {
      // 检查坐标点是否在对象的边界框内
      console.log(object);

      const pointer = new fabric.Point(x, y);
      if (object.visible && object.containsPoint(pointer)) {
        objects.push(object);
      }
    });
    return objects;
  }
  // 设置标注类型
  setLabelType(type?: LabelType) {
    this.labelType = type ?? undefined;
  }

  // 画点
  addPoint(_options: fabric.IEvent<MouseEvent>) {
    const { x, y } = _options.pointer!;
    const point = new fabric.Circle({
      left: x, // 点的 x 坐标
      top: y, // 点的 y 坐标
      radius: 2, // 点的半径，可以根据需要调整大小
      fill: "red", // 点的颜色
      strokeWidth: 0, // 描边宽度为 0
      originX: "center", // 设置原点到圆心，以便正确定位
      originY: "center",
      hasControls: false,
    });
    this.canvas.add(point);
  }

  // 画框 flag ? 点击 ： 移动
  addRect(_options: fabric.IEvent<MouseEvent>, flag: boolean) {
    const { x, y } = _options.pointer!;

    if (flag) {
      // 点击
      if (this.isLabeling && this.rect) {
        this.rect.set({
          width: x - this.rect.left!,
          height: y - this.rect.top!,
        });
        this.canvas.renderAll();
        this.rect = undefined;
        this.isLabeling = false;
      } else {
        this.isLabeling = true;
        this.rect = new fabric.Rect({
          left: x,
          top: y,
          fill: "red",
          width: 5,
          height: 5,
          opacity: 0.5,
        });
        this.canvas.add(this.rect);
      }
    } else {
      // 移动
      if (this.isLabeling && this.rect) {
        this.rect.set({
          width: x - this.rect.left!,
          height: y - this.rect.top!,
        });
        this.canvas.renderAll();
      }
    }
  }

  // 画多边形
  addPolygon(_options: fabric.IEvent<MouseEvent>) {
    console.log(_options);
  }

  // 画圆
  addCircle(_options: fabric.IEvent<MouseEvent>) {
    console.log(_options);
  }
}

export default LabelInit;
