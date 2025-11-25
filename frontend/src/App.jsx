import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [rawData, setRawData] = useState([]);
  const [years, setYears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // 第一次載入時，把整包 /api/raw 抓下來
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/raw");
        const data = res.data;

        setRawData(data);

        // 收集所有「民國年」與「種類」
        const yearSet = new Set();
        const categorySet = new Set();

        data.forEach((row) => {
          yearSet.add(row["民國年"]);
          categorySet.add(row["種類"]);
        });

        // 年份排序（民國年是字串，轉成數字後排序）
        const yearList = Array.from(yearSet).sort(
          (a, b) => Number(a) - Number(b)
        );
        const categoryList = Array.from(categorySet);

        setYears(yearList);
        setCategories(categoryList);

        if (yearList.length > 0) setSelectedYear(yearList[0]);
        if (categoryList.length > 0) setSelectedCategory(categoryList[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // 依照選擇的年 + 種類做篩選，再整理成表格用的格式
  const filtered = rawData
    .filter((row) => {
      if (!selectedYear || !selectedCategory) return false;
      return (
        row["民國年"] === selectedYear && row["種類"] === selectedCategory
      );
    })
    .map((row) => {
      return {
        month: Number(row["月份"]),
        occupancyRate: Number(row["客房住用率"]),
        revenue: Number(row["客房收入"]),
      };
    })
    .sort((a, b) => a.month - b.month);

  return (
    <div style={{ padding: "24px" }}>
      <h1>新竹市旅宿業住宿率儀表板</h1>

      {loading && <p>載入中...</p>}

      {!loading && (
        <>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label>民國年：</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>種類：</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>月份</th>
                <th>客房住用率</th>
                <th>客房收入</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>{row.occupancyRate}</td>
                  <td>{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
