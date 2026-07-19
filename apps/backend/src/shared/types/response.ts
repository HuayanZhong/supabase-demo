/** API 统一响应格式 */
export interface Response<T> {
  code: number;
  data: T;
  msg: string;
}
