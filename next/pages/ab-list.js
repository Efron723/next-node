import { useEffect, useState } from "react";
import DefaultLayout from "@/components/layouts/default-layout";
import { AB_LIST } from "@/config/api-path";

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
      <DefaultLayout>
        <div className="container">
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
        </div>
      </DefaultLayout>
    </>
  );
}
