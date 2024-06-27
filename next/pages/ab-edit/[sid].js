import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// 引入後端
import { AB_GET_ITEM, AB_UPDATE_PUT } from "@/config/api-path";
import DefaultLayout from "@/components/layouts/default-layout";
import { z } from "zod";

export default function AbAdd() {
  const router = useRouter();

  const [myForm, setMyForm] = useState({
    sid: 0,
    name: "",
    email: "",
    mobile: "",
    birthday: "",
    address: "",
  });
  const [myFormErrors, setMyFormErrors] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const onChange = (e) => {
    console.log(e.target.name, e.target.value);
    const newForm = { ...myForm, [e.target.name]: e.target.value };
    console.log(newForm);
    setMyForm(newForm);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // 如果表單驗證有通過的話

    const schemaForm = z.object({
      name: z.string().min(2, { message: "姓名至少兩個字" }),
      email: z.string().email({ message: "請填寫正確的電郵格式" }),
      mobile: z
        .string()
        .regex(/09\d{2}-?\d{3}-?\d{3}/, { message: "請填寫正確的手機格式" }),
    });

    const result2 = schemaForm.safeParse(myForm);
    // console.log(JSON.stringify(result2, null, 4));

    // 重置 myFormErrors
    const newFormErrors = {
      name: "",
      email: "",
      mobile: "",
    };
    if (!result2.success) {
      if (result2?.error?.issues?.length) {
        for (let issue of result2.error.issues) {
          newFormErrors[issue.path[0]] = issue.message;
        }
        setMyFormErrors(newFormErrors);
      }
      return; // 表單資料沒有通過檢查就直接返回
    }
    // 走到這邊表示, 表單有通過驗證
    try {
      const newMyForm = { ...myForm };
      delete newMyForm.sid;
      delete newMyForm.created_at;

      const r = await fetch(`${AB_UPDATE_PUT}/${router.query.sid}`, {
        method: "PUT",
        body: JSON.stringify(newMyForm),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await r.json();
      console.log(result);
      if (result.success) {
        alert("修改成功");
        router.push("/ab-list"); // 跳回列表頁
      } else {
        alert("資料沒有修改");
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    fetch(`${AB_GET_ITEM}/${router.query.sid}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.success) {
          setMyForm(result.data);
        } else {
          router.push("/ab-list"); // 跳回列表頁
        }
      })
      .catch((ex) => {});
  }, [router]);

  return (
    <DefaultLayout title="編輯通訊錄">
      <div className="row">
        <div className="col-6">
          {!!myForm.sid && (
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
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
