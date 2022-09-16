export class Utils {
  public static clamp(n: number, min: number, max: number): number {
    return Math.min(Math.max(min, n), max);
  }

  public static mean(arr: number[]) {
    let sum = 0;
    for (const num of arr) {
      sum += num;
    }
    return sum / arr.length;
  }

  public static randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}