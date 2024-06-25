import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AB_LIST } from "@/config/api-path";
import Link from "next/link";
import DefaultLayout from "@/components/layouts/default-layout";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";

export default function AbAdd() {
  const [myForm, setMyForm] = useState({
    // 初始化
    name: "",
    email: "",
    mobile: "",
    birthday: "",
    address: "",
  });

  // defaultValue={} 不可控表單
  // onChange={} 可控表單

  /* ex: 可控表單
      1. e.target.name 是 "email"，e.target.value 是用戶輸入的值。
      2. [e.target.name]: e.target.value 變成 "email": 用戶輸入的值。
      3. 創建 newForm，它包含了 myForm 的所有現有屬性和 "email" 的新值。
      4. 使用 setMyForm(newForm) 更新狀態，觸發組件重新渲染並顯示新的 email 值
  */

  const onChange = (e) => {
    console.log(e.target.name, e.target.value);

    // myForm 對象中的所有屬性展開到新對象 newForm 中
    // [e.target.name] 會自動抓取當前 input 元素的 name 屬性，
    // 也就是說 e.target.value 會動態設置給 e.target.name
    const newForm = { ...myForm, [e.target.name]: e.target.value };
    console.log(newForm);
    setMyForm(newForm);
  };

  return (
    <DefaultLayout title="新增通訊錄" pageName="ab-add">
      <div className="row">
        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">新增資料</h5>
              <form name="form1">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    姓名
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    // 實現受控組件
                    // 將 input 元素的值綁定到組件的狀態 myForm.name
                    // 表單元素的值完全由 myForm 狀態控制。當 myForm.name 改變時，input 元素的值會自動更新
                    value={myForm.name}
                    // onChange 事件處理函數會即時更新狀態
                    onChange={onChange}
                  />
                  <div className="form-text"></div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    value={myForm.email}
                    onChange={onChange}
                  />
                  <div className="form-text"></div>
                </div>

                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">
                    手機
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="mobile"
                    name="mobile"
                    value={myForm.mobile}
                    onChange={onChange}
                  />
                  <div className="form-text"></div>
                </div>

                <div className="mb-3">
                  <label htmlFor="birthday" className="form-label">
                    生日
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="birthday"
                    name="birthday"
                    value={myForm.birthday}
                    onChange={onChange}
                  />
                  <div className="form-text"></div>
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    地址
                  </label>

                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    cols="30"
                    rows="3"
                    value={myForm.address}
                    onChange={onChange}
                  ></textarea>
                  <div className="form-text"></div>
                </div>

                <button type="submit" className="btn btn-primary">
                  新增
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
