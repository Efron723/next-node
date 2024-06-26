// 連到後端 port
export const API_SERVER = "http://localhost:3001";

// 連到後端資料頁
export const AB_LIST = `${API_SERVER}/address-book/api`;

// 連到後端新增資料頁
export const AB_ADD_POST = `${API_SERVER}/address-book/add`;

// `${API_SERVER}/address-book/api/${sid}`, method: DELETE
export const AB_ITEM_DELETE = `${API_SERVER}/address-book/api`;

// `${API_SERVER}/address-book/api/${sid}`, method: GET, 取得單筆資料
export const AB_GET_ITEM = `${API_SERVER}/address-book/api`;

// `${API_SERVER}/address-book/api/${sid}`, method: PUT, 修改單筆資料
export const AB_UPDATE_PUT = `${API_SERVER}/address-book/api`;