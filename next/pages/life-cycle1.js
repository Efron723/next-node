import React, { useRef, useState } from "react";
import LifeA from "@/components/common/life-a";

export default function LifeCycle1() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow((old) => !old)}>顯示或隱藏</button>
      <div>{show && <LifeA />}</div>
    </div>
  );
}
