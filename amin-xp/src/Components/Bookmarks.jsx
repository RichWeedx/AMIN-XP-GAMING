import React from "react";
import "./NewsModal.css";
import "./Modal.css";
import "./Bookmarks.css";
import gameImg from "../assets/images/game.jpg";

const BookMarks = ({
  show,
  bookmarks,
  onClose,
  onSelectArticle,
  onDeleteBookmark,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <h2 className="bookmarks-heading">Saved Gaming Articles</h2>
        <div className="bookmarks-list">
          {bookmarks.length === 0 ? (
            <p className="bookmarks-empty-message">
              You don&apos;t have any favorite articles yet.
            </p>
          ) : (
            bookmarks.map((article, index) => (
              <div
                className="bookmark-item"
                key={index}
                onClick={() => onSelectArticle(article)}
              >
                <img src={article.image || gameImg} alt={article.title} />
                <h3>{article.title}</h3>
                <span
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBookmark(article);
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookMarks;
