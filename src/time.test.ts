import * as assert from "assert";
import TimeUtil from "./time";

describe("timeUtil", () => {
  it("now", async () => {
    try {
      const result = TimeUtil.now();
      // logger.error(result)
      // assert.strictEqual(tx['outputWithIndex'][0]['address'], 'moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP')
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("sub", async () => {
    try {
      const result = TimeUtil.sub(TimeUtil.now(), 1, "d");
      // logger.error(result)
      // assert.strictEqual(tx['outputWithIndex'][0]['address'], 'moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP')
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("add", async () => {
    try {
      const result = TimeUtil.add(TimeUtil.now(), 1, "d");
      // logger.error(result)
      // assert.strictEqual(tx['outputWithIndex'][0]['address'], 'moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP')
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("lt", async () => {
    try {
      const result = TimeUtil.lt(TimeUtil.now(), "2018-04-26 15:04:00");
      // logger.error(result)
      // assert.strictEqual(tx['outputWithIndex'][0]['address'], 'moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP')
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("timeout", async () => {
    try {
      const a = `111`;
      const result = await TimeUtil.timeout(
        async (): Promise<{ a: string }> => {
          console.log(a);
          await TimeUtil.sleep(2000);
          return {
            a: `11`,
          };
        },
        3000
      );
      console.error(result.a);
      // assert.strictEqual(tx['outputWithIndex'][0]['address'], 'moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP')
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("diff", async () => {
    try {
      const result = TimeUtil.diff(
        TimeUtil.toMomentObj("2018-04-26 15:02:01"),
        TimeUtil.toMomentObj("2018-04-26 15:04:00"),
        "minutes"
      );
      // logger.error(result)
      assert.strictEqual(result, -1);

      const result1 = TimeUtil.diff(
        TimeUtil.toMomentObj(1730433284000),
        TimeUtil.toMomentObj(1730373167283),
        "hours"
      );
      assert.strictEqual(result1, 16);
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("utcStandardStrToTimestamp", async () => {
    try {
      const result = TimeUtil.utcStandardStrToTimestamp(
        "2018-05-18T09:06:03.000Z"
      );
      // logger.error(result)
      assert.strictEqual(result, 1526634363000);
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("toLocalStr", async () => {
    try {
      const result = TimeUtil.toLocalStr(1730373167283);
      assert.strictEqual(result, "2024-10-31 19:12:47");
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("utcStandardStrToMomentObj", async () => {
    try {
      const result = TimeUtil.utcStandardStrToMomentObj(
        "2018-05-18T09:06:03.000Z"
      );
      // logger.error(result, TimeUtil.now())
      // assert.strictEqual(result, 1526634363000)
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("toObject", async () => {
    try {
      const result = TimeUtil.toObject("2018-05-18 09:06:03");
      // console.error(result)
      assert.strictEqual(result[`years`], 2018);
      assert.strictEqual(result[`months`], 4);
      assert.strictEqual(result[`date`], 18);
      assert.strictEqual(result[`hours`], 9);
      assert.strictEqual(result[`minutes`], 6);
      assert.strictEqual(result[`seconds`], 3);
      assert.strictEqual(result[`milliseconds`], 0);
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("currentTimestamp", async () => {
    try {
      const result = TimeUtil.currentTimestamp();
      console.error(result);
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });

  it("lt", async () => {
    try {
      const result = TimeUtil.lt(
        TimeUtil.toMomentObj(1730373167283),
        1730373167282
      );
      assert.strictEqual(result, false);
    } catch (err) {
      console.error(err);
      assert.throws(() => {}, err);
    }
  });
});
