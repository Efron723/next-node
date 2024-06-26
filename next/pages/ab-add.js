import { useState } from "react";
// 引入後端
import { AB_ADD_POST } from "@/config/api-path";
import DefaultLayout from "@/components/layouts/default-layout";
import { z } from "zod";
import { useRouter } from "next/router";

export default function AbEdit() {
  const router = useRouter();

  const [myForm, setMyForm] = useState({
    // 初始化
    name: "",
    email: "",
    mobile: "",
    birthday: "",
    address: "",
  });

  // 初始化 myFormErrors
  const [myFormErrors, setMyFormErrors] = useState({
    name: "",
    email: "",
    mobile: "",
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

    // 做表單的驗證
    // 驗證 string 類型的 email，message 寫格式不正確提示訊息

    // const schemaEmail = z.string().email({ message: "請填寫正確的電郵格式" });

    // 如果 name === email 就驗證

    // if (e.target.name === "email") {
    //   const result = schemaEmail.safeParse(e.target.value);
    //   console.log(JSON.stringify(result, null, 4));
    // }

    /*
    {
    "success": false,
    "error": {
        "issues": [
            {
                "validation": "regex",
                "code": "invalid_string",
                "message": "請填寫正確的手機格式",
                "path": [
                    "mobile"
                ]
            }
        ],
        "name": "ZodError"
    }
}
    */

    // 多欄驗證
    const schemaForm = z.object({
      name: z.string().min(2, { message: "姓名至少兩個字" }),
      email: z.string().email({ message: "請填寫正確的電郵格式" }),
      mobile: z
        .string()
        .regex(/09\d{2}-?\d{3}-?\d{3}/, { message: "請填寫正確的手機格式" }),
    });

    // myForm 對象中的所有屬性展開到新對象 newForm 中
    // [e.target.name] 會自動抓取當前 input 元素的 name 屬性，
    // 也就是說 e.target.value 會動態設置給 e.target.name

    const newForm = { ...myForm, [e.target.name]: e.target.value };

    // safeParse 方法會驗證 newForm 是否符合 schemaForm 定義的結構
    const result2 = schemaForm.safeParse(newForm);
    console.log(JSON.stringify(result2, null, 4));

    // 重置 myFormErrors
    const newFormErrors = {
      name: "",
      email: "",
      mobile: "",
    };

    if (!result2.success && result2?.error?.issues?.length) {
      for (let issue of result2.error.issues) {
        newFormErrors[issue.path[0]] = issue.message;
      }
    }
    setMyFormErrors(newFormErrors);
    console.log(newForm);
    setMyForm(newForm);
  };

  // 新增資料進資料庫
  const onSubmit = async (e) => {
    e.preventDefault();
    // 如果表單驗證有通過的話
    try {
      const r = await fetch(AB_ADD_POST, {
        method: "POST",
        body: JSON.stringify(myForm),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await r.json();
      console.log(result);
      if (result.success) {
        router.push(`/ab-list`); // 成功送出就跳頁
      } else {
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <DefaultLayout title="新增通訊錄" pageName="ab-add">
      <div className="row">
        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">新增資料</h5>
              <form name="form1" onSubmit={onSubmit}>
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
                  {/* 輸入正確後重置 myFormErrors */}
                  <div className="form-text">{myFormErrors.name}</div>
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
                  <div className="form-text">{myFormErrors.email}</div>
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
                  <div className="form-text">{myFormErrors.mobile}</div>
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
