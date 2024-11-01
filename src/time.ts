import moment, {
  Moment,
  MomentInput,
  MomentObjectOutput,
  unitOfTime,
} from "moment";
import util from "util";

/**
 * 时间工具类
 * 2018-03-04T22:51:40+08:00 表示 2018-03-04 22:51:40 是utc时间+8之后的时间，utc时间是2018-03-04 14:51:40
 */
export default class TimeUtil {
  /**
   * await 可同步
   * @param fun
   * @param interval
   * @param exitIfErr
   * @returns {Promise<void>}
   */
  static async setInterval(
    fun: () => Promise<any>,
    interval: number,
    exitIfErr: boolean = false
  ): Promise<void> {
    while (true) {
      try {
        const result = await fun();
        if (result === 0) {
          break;
        }
      } catch (err) {
        console.error(util.inspect(err));
        if (exitIfErr === true) {
          throw err;
        }
      }
      await TimeUtil.sleep(interval);
    }
  }

  /**
   * 一直阻塞，等待信号
   * @param globalName {string} 代表信号的全局变量  0 终止阻塞  1 继续阻塞
   * @param msg
   * @returns {Promise<void>}
   */
  static async sleepSyncFor(
    globalName: string = "signal",
    msg: string = "blocking..."
  ): Promise<void> {
    while (global[globalName] === 1) {
      msg && console.info(msg);
      await TimeUtil.sleep(3000);
    }
  }

  static async sleepFor(
    globalSignalName: string = "signal",
    globalRunningNumName: string = "runningNum",
    msg: string = "blocking..."
  ): Promise<void> {
    global[globalSignalName] = 1; // 指示所有程序该停了
    while (
      global[globalRunningNumName] !== 0 &&
      global[globalRunningNumName] !== undefined
    ) {
      msg && console.info(msg, `running: ${global[globalRunningNumName]}`);
      await TimeUtil.sleep(2000);
    }
  }

  static sleep(sleep: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, sleep);
    });
  }

  /**
   * 超时包装函数。超时抛错，没超时返回异步函数的返回值
   * @param fun 异步函数
   * @param timeout 超时时间
   */
  static timeout<T>(fun: () => Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      fun(),
      new Promise((_, reject) => {
        setTimeout(() => reject(`timeout`), timeout);
      }) as any,
    ]);
  }

  /**
   * utc标准时间字符串转化为时间戳
   * @param mysqlDateTime
   * @returns {number}
   */
  static utcStandardStrToTimestamp(mysqlDateTime: string): number {
    return moment(mysqlDateTime).valueOf();
  }

  static currentTimestamp(): number {
    return moment().valueOf();
  }

  /**
   * 时间戳转换为UTC字符串
   * @param data
   * @param format
   * @returns {string}
   */
  static toUtcStr(
    data: string | number | Date,
    format: string = "YYYY-MM-DD HH:mm:ss:SSS"
  ): string {
    return moment.utc(data).format(format);
  }

  static toUtcStandardStr(timestamp: number): string {
    return moment.utc(timestamp).toISOString(false);
  }

  /**
   * 生成utc标准时间字符串
   * @param year
   * @param month
   * @param day
   * @param hour
   * @param minute
   * @param second
   * @param millisecond
   * @param keepOffset {boolean} true的话就是2018-03-04T22:51:40.952+08:00, false就是2018-03-04T14:51:40.952Z
   * @returns {string}
   */
  static geneUtcStandardStr(
    year: number,
    month: number = 2,
    day: number = 1,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0,
    keepOffset: boolean = true
  ): string {
    return moment
      .utc(new Date(year, month - 1, day, hour, minute, second, millisecond))
      .toISOString(keepOffset);
  }

  static toObject(timeStr: string): MomentObjectOutput {
    return moment(timeStr).toObject();
  }

  /**
   * 生成utc时间字符串
   * @param year
   * @param month
   * @param day
   * @param hour
   * @param minute
   * @param second
   * @param millisecond
   * @param format
   * @returns {string}
   */
  static geneUtcStr(
    year: number,
    month: number = 2,
    day: number = 1,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0,
    format: string = "YYYY-MM-DD HH:mm:ss"
  ): string {
    return moment
      .utc(new Date(year, month - 1, day, hour, minute, second, millisecond))
      .format(format);
  }

  /**
   * utc时间转化为本地时间
   * @param date Date对象 或者 utc标准时间字符串 或者 时间戳
   * @param format
   * @returns {string}
   */
  static toLocalStr(
    data: string | number | Date,
    format: string = "YYYY-MM-DD HH:mm:ss"
  ): string {
    return moment.utc(data).local().format(format);
  }

  /**
   * 获取现在时刻的utc标准字符串
   */
  static getCurrentUtcStandardStr(keepOffset: boolean = true): string {
    return moment.utc(new Date()).toISOString(keepOffset);
  }

  /**
   * 当前时间
   * @returns {*|moment.Moment}
   */
  static now(): Moment {
    return moment();
  }

  /**
   * 时间减
   * @param momentObj {object}
   * @param num {number}
   * @param unit {unitOfTime.Diff}
   * @returns {moment.Moment}
   */
  static sub(momentObj: Moment, num: number, unit: unitOfTime.Diff): Moment {
    return momentObj.subtract(num as any, unit);
  }

  static add(momentObj: Moment, num: number, unit: unitOfTime.Diff): Moment {
    return momentObj.add(num as any, unit);
  }

  /**
   * 小于
   * @param momentObj
   * @param time {Moment|String|Number|Date}
   * @returns {*|boolean}
   */
  static lt(momentObj: Moment, time: Moment | String | Number | Date): boolean {
    return momentObj.isBefore(time as any);
  }

  static gt(momentObj: Moment, time: Moment | String | Number | Date): boolean {
    return momentObj.isAfter(time as any);
  }

  static gtAndLt(
    momentObj: Moment,
    startTime: MomentInput,
    endTime: MomentInput
  ): boolean {
    return momentObj.isBetween(startTime, endTime);
  }

  static toMomentObj(str: string | number | Date): Moment {
    return moment(str);
  }

  /**
   * 比较两个时间相差多少, 前者减后者
   * @param momentObj1 {object}
   * @param momentObj2 {object}
   * @param unit {string} years, months, weeks, days, hours, minutes, seconds
   * @returns {*|number}
   */
  static diff(
    momentObj1: Moment,
    momentObj2: Moment,
    unit: unitOfTime.Diff
  ): number {
    return momentObj1.diff(momentObj2, unit);
  }

  static utcStandardStrToMomentObj(mysqlDateTime: string): Moment {
    return moment(mysqlDateTime);
  }
}
