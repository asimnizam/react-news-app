import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthUser from './AuthUser';

const News = () => {
  const { http } = AuthUser();
  const [userdetail, setUserdetail] = useState(null);
  const [userId, setUserId] = useState('');
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchArticles = async () => {
    try {
      const apiKey = 'c3231efd4bc54686b28c9273e57e4e2c';
      let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

      if (keyword) {
        url += `&q=${encodeURIComponent(keyword)}`;
      }

      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setArticles(data.articles);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserSettings = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`/user/${userId}/settings`);
      const data = response.data;

      if (response.status === 200) {
        setCategories(data.selectedCategories);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserDetail = async () => {
      try {
        const res = await http.post('/me');
        if (isMounted) {
          setUserdetail(res.data);
          setUserId(res.data.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDetail();

    return () => {
      isMounted = false;
    };
  }, [http]);

  useEffect(() => {
    if (userdetail) {
      fetchUserSettings();
    } else {
      // If user not logged in or userdetail is not available, populate categories with dummy data
      const dummyCategories = [
        'Business',
        'Entertainment',
        'Health',
        'Science',
        'Sports',
        'Technology',
      ];
      setCategories(dummyCategories);
    }
  }, [userdetail, userId]);

  useEffect(() => {
    fetchArticles();
  }, [keyword, category]);

  const handleSearch = () => {
    fetchArticles();
  };

  return (
    <div>
      <h2>News Articles</h2>
      <div className="row">
        <div className="col-lg-6 mb-3">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="keyword"
              placeholder="Enter keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-6 mb-3">
          <div className="form-group">
            <select
              className="form-control"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option value={cat} key={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-12">
          <button className="btn btn-primary btn-lg" type="button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="row">
        {articles.map((article, index) => {
          const description = article.description ? article.description.replace(/<\/?ol[^>]*>|<\/?li[^>]*>/g, '') : '';

          return (
            <div className="col-md-4" key={index}>
              <div className="card mb-4">
                <img
                  src={article.urlToImage}
                  className="card-img-top img-fluid"
                  alt={article.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{article.title}</h5>
                  <p className="card-text flex-grow-1">{description}</p>
                  <p>Author: {article.author}</p>
                  <p>Date: {article.publishedAt.substring(0, 10)}</p>
                  <p>Source: {article.source.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default News;
