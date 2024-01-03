/**
 * 직선 보간법
 *
 * 결과값 = (범위 최솟값의 계수) + {(범위 최댓값의 계수) - (범위 최솟값의 계수)} * {(실제 값) - (범위 최솟값)}/{(범위 최댓값) - (범위 최솟값)}
 */
export const getLinearConstant = (value: number, minValue: number, maxValue: number, minCoefficient: number, maxCoefficient: number): number => {
  // 2자리 올림
  return minCoefficient + ((maxCoefficient - minCoefficient) * (value - minValue)) / (maxValue - minValue);
}
