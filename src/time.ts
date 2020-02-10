import '@pefish/js-node-assist'
import moment from 'moment'
import { resolve } from 'dns';

/**
 * 时间工具类
 * 2018-03-04T22:51:40+08:00 表示 2018-03-04 22:51:40 是utc时间+8之后的时间，utc时间是2018-03-04 14:51:40
 */
export default class TimeUtil {

  /**
   * 异步
   * @param fun
   * @param interval
   * @param command
   */
  static setInterval(fun: () => Promise<any>, interval: number, command: number = 1): void {
    // 1正常运行、0停止、2忽略下一次执行
    setTimeout(async () => {
      try {
        if (command === 0) {
          // logger.error('task已停止')
        } else if (command === 1) {
          const result = await fun()
          command = (result !== undefined ? result : 1)
        } else if (command === 2) {
          command = 1
          // logger.info('此次循环被忽略')
        } else if (command === -1) {
          return  // 终止定时器
        }
      } catch (err) {
        global.logger.error(err)
      }
      TimeUtil.setInterval(fun, interval, command)
    }, interval)
  }

  /**
   * await 可同步
   * @param fun
   * @param interval
   * @param exitIfErr
   * @returns {Promise<void>}
   */
  static async setIntervalV2(fun: () => Promise<any>, interval: number, exitIfErr: boolean = false): Promise<void> {
    while (true) {
      try {
        const result = await fun()
        if (result === 0) {
          break
        }
      } catch (err) {
        global.logger.error(err)
        if (exitIfErr === true) {
          throw err
        }
      }
      await TimeUtil.sleep(interval)
    }
  }

  /**
   * 一直阻塞，等待信号
   * @param globalName {string} 代表信号的全局变量  0 终止阻塞  1 继续阻塞
   * @param msg
   * @returns {Promise<void>}
   */
  static async sleepSyncFor(globalName: string = 'signal', msg: string = 'blocking...'): Promise<void> {
    while (global[globalName] === 1) {
      msg && global.logger.info(msg)
      await TimeUtil.sleep(3000)
    }
  }

  static async sleepFor(globalSignalName: string = 'signal', globalRunningNumName: string = 'runningNum', msg: string = 'blocking...'): Promise<void> {
    global[globalSignalName] = 1 // 指示所有程序该停了
    while (global[globalRunningNumName] !== 0 && global[globalRunningNumName] !== undefined) {
      msg && global.logger.info(msg, `running: ${global[globalRunningNumName]}`)
      await TimeUtil.sleep(2000)
    }
  }

  static sleep(sleep: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, sleep)
    })
  }

  /**
   * 超时包装函数。超时返回 true，没超时返回异步函数的返回值
   * @param fun 异步函数
   * @param timeout 超时时间
   */
  static timeout(fun: () => Promise<any>, timeout: number): Promise<boolean> {
    return Promise.race([
      fun(),
      new Promise((resolve, _) =>
        setTimeout(() => resolve(true), timeout)
      ),
    ])
  }

  /**
   * utc标准时间字符串转化为时间戳
   * @param mysqlDateTime
   * @returns {number}
   */
  static utcStandardStrToTimestamp(mysqlDateTime: string): number {
    return moment(mysqlDateTime).valueOf()
  }

  /**
   * 时间戳转换为UTC字符串
   * @param timestamp
   * @param format
   * @returns {string}
   */
  static toUtcStr(timestamp: number, format: string = 'YYYY-MM-DD HH:mm:ss:SSS'): string {
    return moment.utc(timestamp).format(format)
  }

  static toUtcStandardStr(timestamp: number): string {
    return moment.utc(timestamp).toISOString(false)
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
  static geneUtcStandardStr(year: number, month: number = 2, day: number = 1, hour: number = 0, minute: number = 0, second: number = 0, millisecond: number = 0, keepOffset: boolean = true): string {
    return moment.utc(new Date(year, month - 1, day, hour, minute, second, millisecond)).toISOString(keepOffset)
  }

  static toObject(timeStr: string): any {
    return moment(timeStr).toObject()
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
  static geneUtcStr(year: number, month: number = 2, day: number = 1, hour: number = 0, minute: number = 0, second: number = 0, millisecond: number = 0, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return moment.utc(new Date(year, month - 1, day, hour, minute, second, millisecond)).format(format)
  }

  /**
   * utc时间转化为本地时间
   * @param date Date对象或者utc标准时间字符串
   * @param format
   * @returns {string}
   */
  static toLocalStr(date: string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return moment.utc(date).local().format(format)
  }

  /**
   * 获取现在时刻的utc标准字符串
   */
  static getCurrentUtcStandardStr(keepOffset: boolean = true): string {
    return moment.utc(new Date()).toISOString(keepOffset)
  }

  /**
   * 当前时间
   * @returns {*|moment.Moment}
   */
  static now(): any {
    return moment()
  }

  /**
   * 时间减
   * @param momentObj {object}
   * @param num {number}
   * @param unit {string}
   * @returns {moment.Moment}
   */
  static sub(momentObj: any, num: number, unit: string): any {
    return momentObj.subtract(num, unit)
  }

  static add(momentObj: any, num: number, unit: string): any {
    return momentObj.add(num, unit)
  }

  /**
   * 小于
   * @param momentObj
   * @param time {Moment|String|Number|Date|Array}
   * @returns {*|boolean}
   */
  static lt(momentObj: any, time: any): boolean {
    return momentObj.isBefore(time)
  }

  static gt(momentObj: any, time: any): boolean {
    return momentObj.isAfter(time)
  }

  static gtAndLt(momentObj: any, startTime: any, endTime: any): boolean {
    return momentObj.isBetween(startTime, endTime)
  }

  static toMomentObj(str: string): any {
    return moment(str)
  }

  /**
   * 比较两个时间相差多少, 前者减后者
   * @param momentObj1 {object}
   * @param momentObj2 {object}
   * @param unit {string} years, months, weeks, days, hours, minutes, seconds
   * @returns {*|number}
   */
  static diff(momentObj1: any, momentObj2: any, unit: string): number {
    return momentObj1.diff(momentObj2, unit)
  }

  static utcStandardStrToMomentObj(mysqlDateTime: string): any {
    return moment(mysqlDateTime)
  }
}
