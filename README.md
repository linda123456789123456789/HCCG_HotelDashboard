# HCCG Hotel Dashboard

新竹市旅宿業住宿率儀表板  
資料來源：新竹市政府資料開放平臺  
`https://odws.hccg.gov.tw/001/Upload/25/opendataback/9059/276/8b8ac782-570e-4b05-aba1-a6cb69b803ac.json`

---

## 專案目的

- 設計雲端前端架構，提供 React 靜態網頁部署方案  
- 串接新竹市旅宿業住宿率 Open Data，作為第三方 RESTful API 範例  
- 以前端儀表板方式呈現「民國年 × 種類」下，各月份的：
  - 客房住用率  
  - 客房收入  

---

## 系統功能

- 以下拉選單選擇：
  - 民國年（例如 106, 107, …）
  - 住宿種類（觀光旅館、一般旅館…）
- 自動篩選對應年度＋種類的資料  
- 以表格列出 1–12 月：
  - 月份  
  - 客房住用率  
  - 客房收入  
- 後端作為 proxy，統一向新竹市 Open Data 取資料，解決 CORS 與第三方 API 變動問題  

---

## 技術架構

- Frontend
  - React + Vite
  - Axios 呼叫後端 API
- Backend
  - Python 3
  - FastAPI
  - `requests` 對外部 Open Data 發送 HTTP 請求
- Cloud（架構設計）
  - AWS S3：放置 build 後的 React 靜態檔案
  - AWS CloudFront：CDN + HTTPS 入口
  - AWS API Gateway：提供 REST API Endpoint
  - AWS Lambda (Python)：承載 FastAPI 後端程式
- IaC
  - Terraform：定義 S3 Static Website 等雲端資源（示意）

---

## 專案結構

```text
HCCG_HotelDashboard/
├── frontend/          # React + Vite 前端專案
│   ├── index.html
│   ├── package.json
│   └── src/
│       └── App.jsx    # 主畫面：年分/種類選單＋表格呈現
│
├── backend/           # FastAPI 後端 API
│   ├── main.py        # /api/raw 等路由，proxy HCCG Open Data
│   └── venv/          # Python 虛擬環境（不版控）
│
├── infra/             # Infra as Code (Terraform 等)
│   └── main.tf        # S3 Static Website 等雲端資源定義（示意）
│
├── docs/              # 圖檔與文件（可選）
│   ├── architecture.png  # 雲端前端架構圖
│   ├── cicd.png          # CI/CD 流程圖
│   └── gitflow.png       # Git 協作流程圖
│
└── README.md
