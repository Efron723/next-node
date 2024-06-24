import { useEffect, useState } from "react";
import DefaultLayout from "@/components/layouts/default-layout";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const cartKey = "efron-cart";

  const getCartFromStorage = () => {
    // 找到 localStorage 的資料
    const oriData = localStorage.getItem(cartKey);
    let cartData = []; // 預設值
    try {
      cartData = JSON.parse(oriData);
      if (!Array.isArray(cartData)) {
        cartData = [];
      }
    } catch (ex) {}

    // 一定要 return cartData
    return cartData;
  };

  // 移除項目
  const cartRemoveItem = (pid) => {
    const resultCart = cart.filter((p) => p.id !== pid);
    localStorage.setItem(cartKey, JSON.stringify(resultCart));
    setCart(resultCart);
  };

  // 變更數量
  const cartModifyQty = (pid, qty) => {
    const resultCart = cart.map((p) => {
      if (pid === p.id) {
        return { ...p, quantity: qty };
      } else {
        return { ...p };
      }
    });
    localStorage.setItem(cartKey, JSON.stringify(resultCart));
    setCart(resultCart);
  };

  // 畫面渲染 localStorage
  useEffect(() => {
    // rerender getCartFromStorage
    setCart(getCartFromStorage);
  }, []);

  return (
    <DefaultLayout title="購物車" pageName="cart">
      <h2>購物車</h2>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>移除項目</th>
            <th>商品編號</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th>數量</th>
            <th>小計</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((p) => {
            return (
              <tr key={p.id}>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => cartRemoveItem(p.id)}
                  >
                    移除
                  </button>
                </td>
                <td>{p.id}</td>
                <td>{p.bookname}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <select
                    class="form-select"
                    value={p.quantity}
                    // 傳入 id & value
                    onChange={(e) => cartModifyQty(p.id, e.currentTarget.value)}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </td>
                {/* 商品數量 * 商品價格 */}
                <td>{p.quantity * p.price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DefaultLayout>
  );
}
