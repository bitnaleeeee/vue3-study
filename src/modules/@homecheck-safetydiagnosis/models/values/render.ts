/**
   * x, y좌표
*/
type Coordinate = {
    x : number,
    y : number 
}

/**
   * 좌표상의 모양
*/
export enum pathShape {
    Point       = 'p',
    Circle      = 'c',
    Rect        = 'r',
    Line        = 'l',
    Arrow       = 'a',
    DoubleArrow = 'da',
    Polygon     = 'poly'
}

export const pathShapeString: { [key in pathShape]: string } = {
  [pathShape.Point]: "점",
  [pathShape.Circle]: "원형",
  [pathShape.Rect]: "사각형",
  [pathShape.Line]: "선형",
  [pathShape.Arrow]: "화살",
  [pathShape.DoubleArrow]: "양방향 화살",
  [pathShape.Polygon] : "폴리곤",
};


type RenderReceipe = {
    index: number
    continuous_index : number 
    lineDest : Coordinate
    circleDest : Coordinate 
    textDest: Coordinate
    captions? : string[]
} & Coordinate


/**
   * 캔버스에서 캔버스 렌더링을 위한 임시 저장 값
*/
export type Render = Partial<{
  appearences: Partial<RenderReceipe>;
  slope: Partial<RenderReceipe>;
  subsidence: Partial<RenderReceipe>;
    materials: Partial<RenderReceipe>;
  measurements: Partial<RenderReceipe>
}>;

/**
   * 점, 원, 네모, 선분, 화살표 선분, 양쪽화살표 선분이 표현 가능한 좌표상 값
*/
export type PathShape = Coordinate & {
    type : pathShape  // 기본값 : 점
    value? : CircleValue | RectValue | LineValue | PolygonValue | undefined
    // 원의 반지름, 네모의 크기, 화살표의 방향 및 길이 등을 포함할 수 있는 값 필요
}

type CircleValue = {
    radius : number
}
type RectValue = {
    width : number,
    height : number,
    rotate : number
}

type LineValue = {
    length : number,
    rotate : number
}
type PolygonValue = {
    // 어떻게하지?
    // 언젠가 해보지 뭐
}



