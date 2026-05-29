import React, { useEffect, useState } from "react";
import News from "./Components/News";
import Blogs from "./Components/Blogs";

const App = () => {
  const [showNews, setShowNews] = React.useState(true);
  const [showBlogs, setShowBlogs] = React.useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);

  useEffect(() => {
    const savedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    setBlogs(savedBlogs);
  }, []);

  const handleCreateBlog = (newBlog, isEdit) => {
    setBlogs((prevBlogs) => {
      const updatedBlogs = isEdit
        ? prevBlogs.map((blog) => (blog === selectedPost ? newBlog : blog))
        : [...prevBlogs, newBlog];
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      return updatedBlogs;
    });
    setIsEditing(false);
    setSelectedPost(null);
  };

  const handleEditBlog = (blog) => {
    setSelectedPost(blog);
    setIsEditing(true);
    setOpenCreateForm(false);
    setShowNews(false);
    setShowBlogs(true);
  };

  const handleDeleteBlog = (blogToDelete) => {
    setBlogs((prevBlogs) => {
      const updatedBlogs = prevBlogs.filter((blog) => blog !== blogToDelete);
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      return updatedBlogs;
    });
  };

  const handleShowBlogs = () => {
    setOpenCreateForm(false);
    setIsEditing(false);
    setSelectedPost(null);
    setShowNews(false);
    setShowBlogs(true);
  };

  const handleShowBlogsCreateForm = () => {
    setOpenCreateForm(true);
    setIsEditing(false);
    setSelectedPost(null);
    setShowNews(false);
    setShowBlogs(true);
  };

  const handleBackToNews = () => {
    setShowNews(true);
    setShowBlogs(false);
    setIsEditing(false);
    setSelectedPost(null);
    setOpenCreateForm(false);
  };

  return (
    <div className="container">
      <div className="game-blog">
        {showNews && (
          <News
            onShowBlogs={handleShowBlogs}
            onShowBlogsCreateForm={handleShowBlogsCreateForm}
            blogs={blogs}
            onEditBlog={handleEditBlog}
            onDeleteBlog={handleDeleteBlog}
          />
        )}
        {showBlogs && (
          <Blogs
            onBack={handleBackToNews}
            onCreateBlog={handleCreateBlog}
            editPost={selectedPost}
            isEditing={isEditing}
            openCreateForm={openCreateForm}
          />
        )}
      </div>
    </div>
  );
};

export default App;
