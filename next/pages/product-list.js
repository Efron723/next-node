import React from "react";
import DefaultLayout from "@/components/layouts/default-layout";
import Head from "next/head";
import { products } from "@/data/products";

export default function ProductList() {
  const addToCart = (pid) => {
    // 設定 localStorage key 名稱
    const cartKey = "efron-cart";

    // 設定 item 找到的id === onClick 傳入的值
    const item = products.find((v) => v.id === pid);

    // 沒找到項目就結束
    if (!item) return;

    // 設定 oriData = cartKey
    const oriData = localStorage.getItem(cartKey);

    // 預設 []
    let cartData = [];

    try {
      // 將 oriData 轉為 js 數值或物件
      cartData = JSON.parse(oriData);

      // 如果不是陣列
      if (!Array.isArray(cartData)) {
        // 則為空陣列
        cartData = [];
      }
    } catch (e) {}

    // 購物車裡有沒有這個商品
    const cartItem = cartData.find((v) => v.id === pid);

    // 購物車裡已經有這個商品就不執行
    if (cartItem) return;

    // 往後新增一筆 onClick 傳入的值
    cartData.push({ ...item, quantity: 1 });

    // 將 cartKey 和 轉為 JSON 的 cartData 加到 localStorage
    localStorage.setItem(cartKey, JSON.stringify(cartData));
  };

  return (
    <DefaultLayout title="商品列表" pageName="product-list">
      <Head>
        <meta keyword="Efron" />
      </Head>
      <h2>商品列表</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>商品名稱</th>
            <th>頁數</th>
            <th>價格</th>
            <th>加到購物車</th>
          </tr>
        </thead>
        <tbody>
          {products.map((v, i) => {
            return (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.bookname}</td>
                <td>{v.pages}</td>
                <td>{v.price}</td>
                <td>
                  <button
                    className="btn btn-success"
                    // 傳點到的 id 給 addToCart
                    onClick={() => addToCart(v.id)}
                  >
                    BUY
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DefaultLayout>
  );
}
