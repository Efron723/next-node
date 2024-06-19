import Link from "next/link";
import React from "react";
import { BsCart3 } from "react-icons/bs";

export default function Navbar() {
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
                    className="nav-link active"
                    aria-current="page"
                    href="/product-list"
                  >
                    商品列表
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/ab-list">
                    通訊錄列表
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/cart">
                    <button
                      type="button"
                      class="btn btn-primary position-relative"
                    >
                      <BsCart3 />
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        99+
                        <span class="visually-hidden">unread messages</span>
                      </span>
                    </button>
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
