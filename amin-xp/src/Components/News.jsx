import React, { useEffect, useState } from "react";
import Weather from "./Weather";
import Calendar from "./Calendar";
import "./News.css";
import logoImg from "../assets/images/logo.png";
import placeholderImg from "../assets/images/placeholder.png";
import userImg from "../assets/images/user.jpg";
import gameImg from "../assets/images/game.jpg";
import blogImg1 from "../assets/images/blog1.jpg";
import blogImg2 from "../assets/images/blog2.jpg";
import blogImg3 from "../assets/images/blog3.jpg";
import blogImg4 from "../assets/images/blog4.jpg";
import sandboxImg from "../assets/images/sandbox.jpg";
import gamelistImg from "../assets/images/gamelist.jpg";
import indieImg from "../assets/images/indie.jpg";
import personalImg from "../assets/images/personalpicks.jpg";
import coopImg from "../assets/images/coop.jpg";
import NewsModal from "./NewsModal";
import Bookmarks from "./Bookmarks";
import BlogsModal from "./BlogsModal";

const searchableArticles = [
  {
    title: "Daily & Latest Gaming News For You!",
    image: gameImg,
    description:
      "Stay on top of everything happening in the gaming world. From big studio announcements to surprise indie launches, we cover the latest breaking news, trending stories, and must-know updates every single day.",
    keywords: [
      "general",
      "gaming",
      "gaming news",
      "news",
      "latest news",
      "breaking news",
      "daily news",
    ],
  },
  {
    title: "Game Guides & Tutorials",
    image: gameImg,
    description:
      "Stuck on a tough boss or hunting down every collectible? Our in-depth guides and step-by-step tutorials are here to help. Whether you're a first-timer or a seasoned player, we've got walkthroughs for every skill level.",
    keywords: [
      "guide",
      "guides",
      "tutorial",
      "tutorials",
      "walkthrough",
      "tips",
      "help",
    ],
  },
  {
    title: "Sandbox Games",
    image: sandboxImg,
    description:
      "Explore massive open worlds with no limits. Sandbox games let you build, destroy, roam, and shape the environment however you like. Discover the best open-world titles that reward creativity and freedom above all else.",
    keywords: [
      "sandbox",
      "open world",
      "open world games",
      "sandbox games",
      "exploration",
      "free roam",
    ],
  },
  {
    title: "Must Play Game Lists",
    image: gamelistImg,
    description:
      "Not sure what to play next? These curated lists feature the greatest games ever made, ranked and reviewed by gamers and critics alike. From timeless classics to modern masterpieces, something here will be your next obsession.",
    keywords: [
      "list",
      "lists",
      "best games",
      "must play",
      "game list",
      "top games",
      "ranking",
    ],
  },
  {
    title: "World Of Indie Games",
    image: indieImg,
    description:
      "Independent developers are pushing the boundaries of gaming like never before. Indie titles bring bold ideas, unique art styles, and personal stories that big studios rarely attempt. Dive into the vibrant world of indie gaming and find your next hidden gem.",
    keywords: [
      "indie",
      "indie games",
      "pc games",
      "best pc games",
      "independent games",
      "small studio games",
    ],
  },
  {
    title: "Personal Game Picks",
    image: personalImg,
    description:
      "Hand-picked by Amin himself — these are the games that left a real impression. Each pick comes with a personal take on what makes it special, so you know exactly what you're getting into before you hit download.",
    keywords: [
      "my choices",
      "personal picks",
      "editors choice",
      "editor's choice",
      "recommended",
      "favorites",
    ],
  },
  {
    title: "Top Co-op Adventures",
    image: coopImg,
    description:
      "Everything is better with a friend. These co-op games are built around teamwork, communication, and shared victories. Whether you're playing side by side or online, these are the best games to enjoy together.",
    keywords: [
      "co op",
      "co-op",
      "coop",
      "co op games",
      "multiplayer",
      "cooperative",
      "team games",
      "play with friends",
    ],
  },
];

const normalizeText = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const scoreArticleMatch = ({ title, keywords }, normalizedQuery, queryTokens) =>
  [title, ...keywords].reduce((score, text) => {
    const phrase = normalizeText(text);

    if (phrase === normalizedQuery) {
      return score + 100;
    }

    const phraseTokens = phrase.split(" ");
    const matchedTokens = queryTokens.reduce(
      (count, token) => count + (phraseTokens.includes(token) ? 1 : 0),
      0,
    );
    const containsMatch =
      phrase.includes(normalizedQuery) || normalizedQuery.includes(phrase);

    return score + (containsMatch ? 50 : 0) + matchedTokens * 12;
  }, 0);

const isBookmarked = (bookmarks, article) =>
  bookmarks.some((bookmark) => bookmark.title === article.title);

const BOOKMARKS_STORAGE_KEY = "aminxp-bookmarks";

const getStoredBookmarks = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedBookmarks = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  } catch {
    return [];
  }
};

const News = ({
  onShowBlogs,
  onShowBlogsCreateForm,
  blogs,
  onEditBlog,
  onDeleteBlog,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState(getStoredBookmarks);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [openedFromBookmarks, setOpenedFromBookmarks] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      BOOKMARKS_STORAGE_KEY,
      JSON.stringify(bookmarks),
    );
  }, [bookmarks]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();

    if (!query) {
      return;
    }

    const normalizedQuery = normalizeText(query);
    const queryTokens = normalizedQuery.split(" ").filter(Boolean);
    const bestMatch = searchableArticles.reduce(
      (best, article) => {
        const score = scoreArticleMatch(article, normalizedQuery, queryTokens);
        return score > best.score ? { article, score } : best;
      },
      { article: null, score: 0 },
    );

    setSearchInput("");

    if (bestMatch.article) {
      handleArticleClick(bestMatch.article);
      return;
    }

    alert("Bamboozled, the article's gone sleeping.");
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleBookmarkArticleClick = (article) => {
    setShowBookmarksModal(false);
    setOpenedFromBookmarks(true);
    handleArticleClick(article);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
    if (openedFromBookmarks) {
      setOpenedFromBookmarks(false);
      setShowBookmarksModal(true);
    }
  };
  const handleBookmarkClick = (article) => {
    setBookmarks((prevBookmarks) => {
      const updatedBookmarks = prevBookmarks.find(
        (bookmark) => bookmark.title === article.title,
      )
        ? prevBookmarks.filter((bookmark) => bookmark.title !== article.title)
        : [...prevBookmarks, article];
      return updatedBookmarks;
    });
  };

  const headlineArticle = searchableArticles[0];
  const gridArticles = searchableArticles.slice(1);

  const handleBlogPostClick = (blog) => {
    setSelectedPost(blog);
    setShowBlogModal(true);
  };
  const closeBlogModal = () => {
    setShowBlogModal(false);
    setSelectedPost(null);
  };

  return (
    <div className="news">
      <header className="news-header">
        <div className="logo-group">
          <h1 className="logo">AMIN XP GAMING</h1>
          <img src={logoImg} alt="AMIN XP Logo" className="brand-logo" />
        </div>
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search For Gaming News..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      </header>
      <div className="news-content">
        <div className="navbar">
          <div className="user" onClick={onShowBlogs}>
            <img src={userImg} alt="User Image" />
            <p>Amin's XP</p>
          </div>
          <nav className="categories">
            <h1 className="nav-heading">Categories</h1>
            <div className="nav-links">
              <button type="button" className="nav-link nav-link-button">
                General
              </button>
              <button type="button" className="nav-link nav-link-button">
                Gaming News
              </button>
              <button type="button" className="nav-link nav-link-button">
                Guides & Tutorials
              </button>
              <button type="button" className="nav-link nav-link-button">
                Sandbox Games
              </button>
              <button type="button" className="nav-link nav-link-button">
                Game Lists
              </button>
              <button type="button" className="nav-link nav-link-button">
                Indie Games
              </button>
              <button type="button" className="nav-link nav-link-button">
                My Choices
              </button>
              <button type="button" className="nav-link nav-link-button">
                Co-op Games
              </button>
              <button
                type="button"
                className="nav-link nav-link-button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowBookmarksModal(true);
                }}
              >
                Bookmarks <i className="fa-solid fa-bookmark"></i>
              </button>
            </div>
          </nav>
        </div>
        <div className="news-section">
          <div
            className="headline"
            onClick={() => handleArticleClick(headlineArticle)}
            style={{ cursor: "pointer" }}
          >
            <img src={gameImg} alt="Daily Gaming News" />
            <h2 className="headline-title">
              Daily & Latest Gaming News For You!
            </h2>
            <i
              className={`${isBookmarked(bookmarks, headlineArticle) ? "fa-solid" : "fa-regular"} fa-bookmark bookmark`}
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkClick(headlineArticle);
              }}
            ></i>
          </div>
          <div className="news-grid">
            <div
              className="news-grid-item"
              onClick={() => handleArticleClick(gridArticles[0])}
              style={{ cursor: "pointer" }}
            >
              <img src={gameImg} alt="Game Guides Image" />
              <h3>
                Game Guides & Tutorials
                <i
                  className={`${isBookmarked(bookmarks, gridArticles[0]) ? "fa-solid" : "fa-regular"} fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(gridArticles[0]);
                  }}
                ></i>
              </h3>
            </div>
            <div
              className="news-grid-item"
              onClick={() => handleArticleClick(gridArticles[1])}
              style={{ cursor: "pointer" }}
            >
              <img src={sandboxImg} alt="Sandbox Games" />
              <h3>
                Sandbox Games
                <i
                  className={`${isBookmarked(bookmarks, gridArticles[1]) ? "fa-solid" : "fa-regular"} fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(gridArticles[1]);
                  }}
                ></i>
              </h3>
            </div>
            <div
              className="news-grid-item"
              onClick={() => handleArticleClick(gridArticles[2])}
              style={{ cursor: "pointer" }}
            >
              <img src={gamelistImg} alt="Must Play Game Lists" />
              <h3>
                Must Play Game Lists
                <i
                  className={`${isBookmarked(bookmarks, gridArticles[2]) ? "fa-solid" : "fa-regular"} fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(gridArticles[2]);
                  }}
                ></i>
              </h3>
            </div>
            <div
              className="news-grid-item"
              onClick={() => handleArticleClick(gridArticles[3])}
              style={{ cursor: "pointer" }}
            >
              <img src={indieImg} alt="Indie Games" />
              <h3>
                World Of Indie Games
                <i
                  className={`${isBookmarked(bookmarks, gridArticles[3]) ? "fa-solid" : "fa-regular"} fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(gridArticles[3]);
                  }}
                ></i>
              </h3>
            </div>
            <div
              className="news-grid-item"
              onClick={() => handleArticleClick(gridArticles[4])}
              style={{ cursor: "pointer" }}
            >
              <img src={personalImg} alt="Personal Game Picks" />
              <h3>
                Personal Game Picks
                <i
                  className={`${isBookmarked(bookmarks, gridArticles[4]) ? "fa-solid" : "fa-regular"} fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(gridArticles[4]);
                  }}
                ></i>
              </h3>
            </div>
            <div
              className="news-grid-item"
              onClick={() => handleArticleClick(gridArticles[5])}
              style={{ cursor: "pointer" }}
            >
              <img src={coopImg} alt="Co-op Games" />
              <h3>
                Top Co-op Adventures
                <i
                  className={`${isBookmarked(bookmarks, gridArticles[5]) ? "fa-solid" : "fa-regular"} fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(gridArticles[5]);
                  }}
                ></i>
              </h3>
            </div>
          </div>
        </div>
        <NewsModal
          show={showModal}
          article={selectedArticle}
          onClose={handleCloseModal}
        />
        <Bookmarks
          show={showBookmarksModal}
          bookmarks={bookmarks}
          onClose={() => setShowBookmarksModal(false)}
          onSelectArticle={handleBookmarkArticleClick}
          onDeleteBookmark={handleBookmarkClick}
        />
        <div className="my-blogs">
          <h1 className="my-blogs-heading">My Blogs</h1>
          {blogs.length === 0 && (
            <button className="create-blog-btn" onClick={onShowBlogsCreateForm}>
              Create a Blog
            </button>
          )}
          <div className="blog-posts">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="blog-post"
                onClick={() => handleBlogPostClick(blog)}
              >
                <img src={blog.image || placeholderImg} alt={blog.title} />
                <h3>{blog.title}</h3>
                <div className="post-buttons">
                  <button
                    className="edit-post"
                    onClick={() => onEditBlog(blog)}
                  >
                    <i className="bx bxs-edit"></i>
                  </button>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBlog(blog);
                    }}
                  >
                    <i className="bx bxs-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedPost && showBlogModal && (
            <BlogsModal
              show={showBlogModal}
              blog={selectedPost}
              onClose={closeBlogModal}
            />
          )}
        </div>
        <div className="weather-calendar">
          <Weather />
          <Calendar />
        </div>
      </div>
      <footer className="news-footer">
        <p>
          <span>Amin XP Gaming</span>
        </p>
        <p>&copy; All Rights Reserved. By Amin Rahmani</p>
      </footer>
    </div>
  );
};

export default News;
