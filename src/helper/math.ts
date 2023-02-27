export function degreeToRadian(degree: number) {
  return degree * (Math.PI / 180);
}

export function radianToDegree(radian: number) {
  return radian * (180 / Math.PI);
}

export function degreeToHour(degree: number) {
  return degree / 15;
}

export function hourToDegree(degree: number) {
  return degree * 15;
}