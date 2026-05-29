import React from "react";
import "./NewsModal.css";

const NewsModal = ({ show, article, onClose }) => {
  if (!show) {
    return null;
  }

  const handleReadMore = (e) => {
    e.preventDefault();
    alert("Bamboozled, the article's gone sleeping.");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <img src={article?.image} alt={article?.title} />
        <h2 className="modal-title">{article?.title}</h2>
        <p className="modal-source">Source: IGN</p>
        <p className="modal-date">June 5, 2024</p>
        <p className="modal-content-text">{article?.description}</p>
        <a href="#" className="read-more-link" onClick={handleReadMore}>
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsModal;
