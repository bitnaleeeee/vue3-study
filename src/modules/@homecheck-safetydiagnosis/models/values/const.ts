import { getLinearConstant } from '@/modules/@homecheck/libs/Functions'
/** 
 * 슈미트 보정치
*/
export enum schmidtAngleConstant {
    Angle90 = 'a90',
    Angle45 = 'a45',
    Angle0 =  'a0',
    Minus45 = 'm45',
    Minus90 = 'm90'
}
export const schmidtAngleConstantString: { [key in schmidtAngleConstant]: string } = {
  [schmidtAngleConstant.Angle90]: "90º",
  [schmidtAngleConstant.Angle45]: "45º",
  [schmidtAngleConstant.Angle0]: "0º",
  [schmidtAngleConstant.Minus45]: "-45º",
  [schmidtAngleConstant.Minus90]: "-90º",
};



/** 
 * 재령 계수 테이블
*/
const concreteValueTable = [
  [4, 1.9],
  [5, 1.84],
  [6, 1.75],
  [7, 1.72],
  [8, 1.67],
  [9, 1.61],
  [10, 1.55],
  [11, 1.49],
  [12, 1.45],
  [13, 1.4],
  [14, 1.36],
  [15, 1.32],
  [16, 1.28],
  [17, 1.25],
  [18, 1.22],
  [19, 1.18],
  [20, 1.15],
  [21, 1.12],
  [22, 1.1],
  [23, 1.08],
  [24, 1.06],
  [25, 1.04],
  [26, 1.02],
  [27, 1.01],
  [28, 1.0],
  [29, 0.99],
  [30, 0.99],
  [32, 0.98],
  [34, 0.96],
  [36, 0.95],
  [38, 0.94],
  [40, 0.93],
  [42, 0.92],
  [44, 0.91],
  [46, 0.9],
  [48, 0.89],
  [50, 0.87],
  [52, 0.87],
  [54, 0.87],
  [56, 0.86],
  [58, 0.86],
  [60, 0.86],
  [62, 0.85],
  [64, 0.85],
  [66, 0.85],
  [68, 0.84],
  [70, 0.84],
  [72, 0.84],
  [74, 0.83],
  [76, 0.83],
  [78, 0.82],
  [80, 0.82],
  [82, 0.82],
  [84, 0.81],
  [86, 0.81],
  [88, 0.8],
  [90, 0.8],
  [100, 0.78],
  [125, 0.76],
  [150, 0.74],
  [175, 0.73],
  [200, 0.72],
  [250, 0.71],
  [300, 0.7],
  [400, 0.68],
  [500, 0.67],
  [750, 0.66],
  [1000, 0.65],
  [2000, 0.64],
  [3000, 0.63],
  [300000000, 0.63],
];

/** 
 * 일자별 재령 계수 계산
 * 
 * 직선보간법에 따라 계산 [최소 날짜, 계수]
 * 
*/
export const getConcreteConstant = (day : number):number => {

    let index = 0;
    for (let i = 0; i < concreteValueTable.length; i++){
        if (day <= concreteValueTable[i][0]) {
            index = i
            break;
        }
    }
    // 기준일과 정확한지 확인
    let correct = index == 0 ? true : (day == concreteValueTable[index][0])
    return correct ? concreteValueTable[index][1] : getLinearConcreteConstant(day, index);
}

function getLinearConcreteConstant(value: number, index: number): number {
  const minCoefficient = concreteValueTable[index - 1][1]; // 범위 최솟값 계수
  const maxCoefficient = concreteValueTable[index][1]; // 범위 최댓값 계수
  const minValue = concreteValueTable[index - 1][0]; // 범위 최솟값
  const maxValue = concreteValueTable[index][0]; // 범위 최댓값

  // 2자리 올림
  return getLinearConstant( value, minValue, maxValue, minCoefficient, maxCoefficient);
}


/*
function getLinearConstant(value :number, index : number) : number{
    const minCoefficient = concreteValueTable[index - 1][1] // 범위 최솟값 계수
    const maxCoefficient = concreteValueTable[index ][1] // 범위 최댓값 계수
    const minValue = concreteValueTable[index - 1][0] // 범위 최솟값
    const maxValue = concreteValueTable[index][0] // 범위 최댓값

    // 2자리 올림
    return minCoefficient + ((maxCoefficient - minCoefficient)*(value - minValue)/(maxValue - minValue))
}
*/




const AngleValueTable = [
    [0, 0, 0, 2.4, 3.2],        //10
    [-5.4, -3.5, 0, 2.5, 3.4],  //20
    [-4.7, -3.1, 0, 2.3, 3.1],  //30
    [-3.9, -2.6, 0, 2.0, 2.6],  //40
    [-3.1, -2.1, 0, 1.6, 2.2],  //50
    [-2.3, -1.6, 0, 1.3, 1.7]   //60
]

const reboundAverageTable = [
    0,10,20,30,40,50,60,70
]
//Rebound elasticity
/** 
 * 각도에 의한 보정치 계산
 * 
 * @argument reboundAverage - 측정 값들의 평균
 * @argument angle -  측정 각도
*/
export const getAngleCorrection = ( reboundAverage: number, angle : schmidtAngleConstant) : number => {

    let index = [-1, -1]
    if(reboundAverage <= 10){
        index[0] = 0
    }
    else if (reboundAverage <= 20){
        index[0] = 1
    }
    else if (reboundAverage <= 30){
        index[0] = 2
    }
    else if (reboundAverage <= 40){
        index[0] = 3
    }
    else if (reboundAverage <= 50){
        index[0] = 4
    }
    else{
        index[0] = 5
    }
    
    switch(angle){
        case schmidtAngleConstant.Angle90:
            index[1] = 0
            break;
        case schmidtAngleConstant.Angle45:
            index[1] = 1
            break;
        case schmidtAngleConstant.Angle0:
            index[1] = 2
            break;
        case schmidtAngleConstant.Minus45:
            index[1] = 3
            break;
        case schmidtAngleConstant.Minus90:
            index[1] = 4
            break;
    }

    const minValue = reboundAverageTable[index[0]];
    const maxValue = reboundAverageTable[index[0] + 1];
    const minCoefficient = AngleValueTable[index[0] != 0 ? (index[0] - 1) : 0][index[1]];
    const maxCoefficient = AngleValueTable[index[0]][index[1]];

    

    return getLinearConstant(reboundAverage, minValue, maxValue, minCoefficient, maxCoefficient);
}



/** 
 * 슈미트 측정 부위
*/
export enum schmidtPosition {
    Side = 's', // 단부
    Center = 'c' // 중앙부
}
export const schmidtPositionString: { [key in schmidtPosition]: string } = {
  [schmidtPosition.Side]: "단부",
  [schmidtPosition.Center]: "중앙부",
};
