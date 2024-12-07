import TimeUtil from "../src/time";

TimeUtil.timeout(async (abortSignal: AbortSignal) => {
  while (!abortSignal.aborted) {
    await TimeUtil.sleep(1000);
    console.log("11");
  }
}, 3000).catch((err) => {
  console.log(err);
});
