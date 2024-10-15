import { notFound } from "next/navigation";

import { DUMMY_NEWS } from "@/dummy-news";

export default function NewsDetailPage({ params }) {
  const newsSlug = params.slug;
  const news = DUMMY_NEWS.find((news) => news.slug === newsSlug);

  if (!news) {
    notFound();
  }

  return (
    <article className="news-article">
      <header>
        <img src={`/images/news/${news.image}`} alt={news.title} />
        <h1>{news.title}</h1>
        <time dateTime={news.date}>{news.date}</time>
      </header>
      <p>{news.content}</p>
    </article>
  );
}
