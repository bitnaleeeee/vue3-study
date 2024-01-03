const parsefloat = (val: string | number): number => {
  return parseFloat(`${val}`);
};

export const calculatePath = (x: number, y: number, offsetX: number, offsetY: number, property: string) => {
  const rotate = 0;

  const radian = parsefloat(rotate) * (Math.PI / 180) * -1;

  //mx
  let tempXPath = parsefloat(x) - parsefloat(offsetX);
  let tempYPath = parsefloat(y) - parsefloat(offsetY);
  // DestX

  switch (property) {
    case "x":
      let DestX = parsefloat(tempXPath) * parsefloat(Math.cos(radian)) + parsefloat(tempYPath) * parsefloat(Math.sin(radian));
      DestX = parsefloat(DestX) + parsefloat(offsetX);
      return DestX;

    case "y":
      let DestY = parsefloat(tempXPath) * parsefloat(Math.sin(radian)) * -1 + parsefloat(tempYPath) * parsefloat(Math.cos(radian));
      DestY = parsefloat(DestY) + parsefloat(offsetY);
      return DestY;
  }
};

export const reversePath = (x: number, y: number, offsetX: number, offsetY: number, property: string) => {
  const rotate = 0;
  const radian = (360 - rotate) * (Math.PI / 180) * -1;

  //mx
  let XPath = x - offsetX;
  let YPath = y - offsetY;
  // DestX

  switch (property) {
    case "x":
      let DestX = parsefloat(XPath) * parsefloat(Math.cos(radian)) + parsefloat(YPath) * parsefloat(Math.sin(radian));
      return parsefloat(DestX) + parsefloat(offsetX);
    default:
      let DestY = parsefloat(XPath) * parsefloat(Math.sin(radian)) * -1 + parsefloat(YPath) * parsefloat(Math.cos(radian));
      return parsefloat(DestY) + parsefloat(offsetY);
  }
}
