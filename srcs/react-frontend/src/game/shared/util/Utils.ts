export class Utils {
  public static clamp(n: number, min: number, max: number) : number {
    return Math.min(Math.max(min, n), max);
  }
}