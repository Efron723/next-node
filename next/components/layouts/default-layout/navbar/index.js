import Link from "next/link";
import React from "react";
import { BsCart3 } from "react-icons/bs";

const navLinkStyle = {
  borderRadius: "6px",
  backgroundColor: "tomato",
  color: "white",
  fontWeight: "900",
};
export default function Navbar({ pageName = "" }) {
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
                    style={pageName === "product-list" ? navLinkStyle : null}
                    href="/product-list"
                  >
                    商品列表
                  </Link>
                </li>
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
                    style={pageName === "cart" ? navLinkStyle : null}
                    href="/cart"
                  >
                    購物車 <span class="badge text-bg-success">3</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
