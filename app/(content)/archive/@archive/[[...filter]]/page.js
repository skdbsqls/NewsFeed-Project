import { Suspense } from "react";
import Link from "next/link";

import NewsList from "@/components/news-list";
import {
  getAvailableNewsMonths,
  getAvailableNewsYears,
  getNewsForYear,
  getNewsForYearAndMonth,
} from "@/lib/news";

async function FilterHeader({ year, month }) {
  // 연도 선택 or 연도 & 월 선택에 맞게 해당 뉴스를 보여줌
  const availableYears = await getAvailableNewsYears();
  let links = availableYears; // 네비바에 보여질 연도 혹은 월의 배열

  // 유효하지 않은 연도 혹은 월에 접근할 경우 오류 발생
  if (
    (year && !availableYears.includes(year)) ||
    (month && !getAvailableNewsMonths(year).includes(month))
  ) {
    throw new Error("Invalid filter.");
  }

  // 연도만 선택한 경우
  if (year && !month) {
    links = getAvailableNewsMonths(year); // links를 연도에서 월로 업데이트
  }
  // 연도 & 월 모두 선택한 경우
  if (year && month) {
    links = []; // links를 월에서 빈 배열로 업데이트
  }

  return (
    <header id="archive-header">
      <nav>
        <ul>
          {links.map((link) => {
            const href = year ? `/archive/${year}/${link}` : `/archive/${link}`;

            return (
              <li key={link}>
                <Link href={href}>{link}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

async function FilteredNews({ year, month }) {
  let news; // 보여질 뉴스 배열

  // 연도만 선택한 경우
  if (year && !month) {
    news = await getNewsForYear(year);
  }
  // 연도 & 월 모두 선택한 경우
  else if (year && month) {
    news = await getNewsForYearAndMonth(year, month);
  }
  // 해당 연도 or 연도 & 월에 뉴스가 없는 경우
  let newsContent = <p>No news found for the selected period.</p>;
  // 해당 연도 or 연도 & 월에 뉴스가 있는 경우
  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }

  return newsContent;
}

export default async function FilterNewsPage({ params }) {
  // archive 이후의 모든 세그먼트들이 배열로 담김
  const filter = params.filter;

  // archive/2024/10 형식에 url일 될테니 배열에 맞게 선택한 연도 & 월을 찾아줌
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  return (
    <>
      <Suspense fallback={<p>Loading filter...</p>}>
        <FilterHeader year={selectedYear} month={selectedMonth} />
      </Suspense>
      <Suspense fallback={<p>Loading news...</p>}>
        <FilteredNews year={selectedYear} month={selectedMonth} />
      </Suspense>
    </>
  );
}
