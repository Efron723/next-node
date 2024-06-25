import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AB_LIST } from "@/config/api-path";
import Link from "next/link";
import DefaultLayout from "@/components/layouts/default-layout";

export default function AbList() {
  // 當用戶點連結 url 變動或 router.push 就會觸發 useRouter，
  // components 就會 render 全部 code 在跑一次
  const router = useRouter();

  // 如果載入太久開始跑 loading 動畫，預設 false
  // const [loading, setLoading] = useState(false);

  // 如果載入錯誤顯示錯誤畫面或訊息
  // const [loadingError, setLoadingError] = useState('');

  const [data, setData] = useState({
    rows: [],
  });

  useEffect(() => {
    // 如果開始抓資料時開始載入動畫，true
    // setLoading(true);

    fetch(`${AB_LIST}?${new URLSearchParams(router.query)}`);

    // 發送 AJAX 請求，並且在組件卸載或依賴變化時能夠取消正在進行的請求，
    // 確保應用程序的穩定性和性能
    const controller = new AbortController();
    const signal = controller.signal;

    // 請求中還包含了前面創建的 signal。這樣可以在需要的時候取消這個請求
    fetch(`${AB_LIST}?${new URLSearchParams(router.query)}`, { signal })
      .then((r) => r.json())
      .then((data) => {
        setData(data);

        // 抓完資料，關閉動畫，false
        // setLoading(false);
      })
      .catch((ex) => {
        // setLoadingError('載入資料時發生錯誤');
        // setLoading(false);

        console.log("fetch-ex:", ex);
      });

    return () => {
      controller.abort(); // 取消上一次的 ajax
    };
  }, [router]); // 依賴 router，url 變動時 render 重新抓資料

  console.log(router.query); // {page: '1'}
  console.log(`ab-list render--------`);

  // router 優先權比 useEffect 高，! 優先權最高不用再括號
  if (!router.isReady || !data.success) return null;
  return (
    <>
      <DefaultLayout title="通訊錄列表" pageName="ab-list">
        <div className="row">
          <div className="col">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                {/* jsx for loop */}
                {/* 注意在元素內，key 跟 id 不能重複 */}
                {Array(11)
                  .fill(1)
                  .map((v, i) => {
                    const p = data.page - 5 + i;
                    // 判斷 p 是不是 NaN，是的話 return null
                    if (isNaN(p)) return null;
                    {
                      /* 如果 page < 1 或 > totalPages return null，null = ""，
                      這樣分頁按鈕就不會顯示 page < 1 或 > totalPages*/
                    }
                    if (p < 1 || p > data.totalPages) return null;
                    return (
                      <li
                        className={
                          data.page === p ? `page-item active` : `page-item`
                        }
                        // key 會比對參照，看你要參照什麼，這邊寫 p 就會返回當下點的 pagination
                        key={p}
                      >
                        {/* Link 分頁按鈕換頁 */}
                        <Link className="page-link" href={`?page=${p}`}>
                          {p}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>姓名</th>
                  <th>電郵</th>
                  <th>手機</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r, i) => {
                  return (
                    <tr key={r.sid}>
                      <td>{r.sid}</td>
                      <td>{r.name}</td>
                      <td>{r.email}</td>
                      <td>{r.mobile}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
