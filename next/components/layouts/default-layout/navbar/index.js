import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/router";

const navLinkStyle = {
  borderRadius: "6px",
  backgroundColor: "tomato",
  color: "white",
  fontWeight: "900",
};
export default function Navbar({ pageName = "" }) {
  const [thisPage, setThisPage] = useState();
  const { auth, logout } = useAuth();

  const router = useRouter();

  useEffect(() => {
    setThisPage(location.href);
  }, [router]);

  return (
    <>
      <div className="container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Navbar
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={pageName === "ab-list" ? navLinkStyle : null}
                    href="/ab-list"
                  >
                    通訊錄列表
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={pageName === "ab-add" ? navLinkStyle : null}
                    href="/ab-add"
                  >
                    新增通訊錄
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={pageName === "product-list" ? navLinkStyle : null}
                    href="/product-list"
                  >
                    商品列表
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={pageName === "cart" ? navLinkStyle : null}
                    href="/cart"
                  >
                    購物車 <span className="badge text-bg-success">3</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={pageName === "quick" ? navLinkStyle : null}
                    href="/quick"
                  >
                    快速登入
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
                {auth.id && auth.nickname ? (
                  <>
                    <li className="nav-item">
                      <a className="nav-link">{auth.nickname}</a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#/"
                        onClick={() => logout()}
                      >
                        登出
                      </a>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      style={pageName === "login-jwt" ? navLinkStyle : null}
                      href={`/login-jwt?u=${thisPage}`}
                    >
                      登入
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
