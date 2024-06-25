import { useRef } from "react";

export default function ChildA() {
  const refA = useRef();
  refA.current ||= 0;
  refA.current++;
  return <div>{refA.current}</div>;
}
