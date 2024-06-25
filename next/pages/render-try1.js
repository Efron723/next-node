import React, { useRef, useState } from "react";
import ChildA from "@/components/common/child-a";

export default function RenderTry1() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>click</button>
      <ChildA />
    </div>
  );
}

