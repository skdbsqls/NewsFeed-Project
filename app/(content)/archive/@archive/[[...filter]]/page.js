import NewsList from "@/components/news-list";
import {
  getAvailableNewsMonths,
  getAvailableNewsYears,
  getNewsForYear,
  getNewsForYearAndMonth,
} from "@/lib/news";
import Link from "next/link";

export default async function FilterNewsPage({ params }) {
  // archive 이후의 모든 세그먼트들이 배열로 담김
  const filter = params.filter;

  // archive/2024/10 형식에 url일 될테니 배열에 맞게 선택한 연도와 월을 찾아줌
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  // 연도 선택 or 연도 및 월 선택에 맞게 해당 뉴스를 보여줌
  let news; // 보여질 뉴스 배열
  let links = await getAvailableNewsYears(); // 네비바에 보여질 연도 혹은 월의 배열

  // 연도만 선택한 경우
  if (selectedYear && !selectedMonth) {
    news = await getNewsForYear(selectedYear);
    links = getAvailableNewsMonths(selectedYear); // links를 연도에서 월로 업데이트
  }
  // 연도 및 월 모두 선택한 경우
  if (selectedYear && selectedMonth) {
    news = await getNewsForYearAndMonth(selectedYear, selectedMonth);
    links = []; // links를 월에서 빈 배열로 업데이트
  }

  // 해당 연도 or 연도 및 월에 뉴스가 없는 경우
  let newsContent = <p>No news found for the selected period.</p>;
  // 해당 연도 or 연도 및 월에 뉴스가 있는 경우
  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }

  const availableYears = await getAvailableNewsYears();

  // 유효하지 않은 연도 혹은 월에 접근할 경우 오류 발생
  if (
    (selectedYear && !availableYears.includes(selectedYear)) ||
    (selectedMonth &&
      !getAvailableNewsMonths(selectedYear).includes(selectedMonth))
  ) {
    throw new Error("Invalid filter.");
  }

  return (
    <>
      <header id="archive-header">
        <nav>
          <ul>
            {links.map((link) => {
              const href = selectedYear
                ? `/archive/${selectedYear}/${link}`
                : `/archive/${link}`;

              return (
                <li key={link}>
                  <Link href={href}>{link}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      {newsContent}
    </>
  );
}
