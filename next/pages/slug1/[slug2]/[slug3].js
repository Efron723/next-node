import { useRouter } from "next/router";
import React from "react";

export default function Slug3() {
  const router = useRouter();

  console.log('router.isReady:', router.isReady);
  console.log("router.query.slug3:", router.query.slug3);

  return <pre>{JSON.stringify(router.query, null, 4)}</pre>;
  // return <div>{router.query.slug3}</div>
}
