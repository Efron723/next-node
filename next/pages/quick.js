import React from "react";
import DefaultLayout from "@/components/layouts/default-layout";
import { useAuth } from "@/contexts/auth-context";

export default function Quick() {
  const { login, logout, auth } = useAuth();

  return (
    <>
      <DefaultLayout title="快速登入" pageName="quick">
        <div>登入者 : {auth.nickname}</div>
        <hr />
        <button
          className="btn btn-success"
          onClick={() => {
            login("ming@gg.com", "13579");
          }}
        >
          登入 ming@gg.com
        </button>
        <hr />
        <button
          className="btn btn-success"
          onClick={() => {
            login("shin@gg.com", "13579");
          }}
        >
          登入 shin@gg.com
        </button>
        <hr />
        <button
          className="btn btn-danger"
          onClick={() => {
            logout();
          }}
        >
          登出
        </button>
      </DefaultLayout>
    </>
  );
}
