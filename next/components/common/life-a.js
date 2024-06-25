import React, { useEffect, useState } from "react";

export default function LifeA() {
  const [val, setVal] = useState(6);
  useEffect(() => {
    let n = 0;
    console.log("已經掛載");
    // 設定一直跑的計時器
    const interval_id = setInterval(() => {
      n++;
      console.log({ n });
    }, 1000);

    return () => {
      console.log("即將卸載");
      clearInterval(interval_id); // 取消計時器的功能
    };
  }, []);

  useEffect(() => {
    console.log("已經更新");
    return () => {
      console.log("即將更新");
    };
  }, [val]);

  return (
    <>
      <div>
        LifeA <button onClick={() => setVal(val + 1)}>加一</button>
      </div>
      <div>{val}</div>
    </>
  );
}
