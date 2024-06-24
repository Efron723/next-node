import { useEffect, useState } from "react";
import DefaultLayout from "@/components/layouts/default-layout";
import { AB_LIST } from "@/config/api-path";
import Link from "next/link";

export default function AbList() {
  const [data, setData] = useState({
    rows: [],
  });

  useEffect(() => {
    fetch(`${AB_LIST}?page=2`)
      .then((r) => r.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <>
      <DefaultLayout title="通訊錄列表" pageName="ab-list">
        <div className="row">
          <div className="col">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                {/* jsx for loop */}
                {Array(11)
                  .fill(1)
                  .map((v, i) => {
                    const p = data.page - 5 + i;
                    {
                      /* 如果 page < 1 或 > totalPages return null，null = ""，
                      這樣分頁按鈕就不會顯示 page < 1 或 > totalPages*/
                    }
                    if (p < 1 || p > data.totalPages) return null;
                    return (
                      <li className="page-item" key={i}>
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
