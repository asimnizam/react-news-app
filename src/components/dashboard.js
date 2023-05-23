import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthUser from './AuthUser';
import { Modal } from 'react-bootstrap';

export default function Dashboard() {
  const { http } = AuthUser();
  const [userdetail, setUserdetail] = useState('');
  const [userId, setUserId] = useState('');
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { scat_id: 'cat1', categoryName: 'general' },
    { scat_id: 'cat2', categoryName: 'world' },
    { scat_id: 'cat3', categoryName: 'nation' },
    { scat_id: 'cat4', categoryName: 'business' },
    { scat_id: 'cat5', categoryName: 'technology' },
    { scat_id: 'cat6', categoryName: 'entertainment' },
    { scat_id: 'cat7', categoryName: 'sports' },
    { scat_id: 'cat8', categoryName: 'science' },
    { scat_id: 'cat9', categoryName: 'health' },
  ];

  const authors = [
    { author_id: 'authorid1', authorName: 'Glenn Greenwald' },
    { author_id: 'authorid2', authorName: 'Marwan Bishara' },
    { author_id: 'authorid3', authorName: 'Laura Kuenssberg' },
    { author_id: 'authorid4', authorName: 'Anderson Cooper' },
    { author_id: 'authorid5', authorName: 'Agencia NOVA' },
  ];

  const sources = [
    { source_id: 'source1', sourceName: 'New York Magazine' },
    { source_id: 'source2', sourceName: 'CNN' },
    { source_id: 'source3', sourceName: 'The Guardian' },
    { source_id: 'source4', sourceName: 'Google News' },
    { source_id: 'source5', sourceName: 'BBC News' },
  ];

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

    const fetchUserSettings = async () => {
      if (!userId) return;
      try {
        const res = await http.get(`/user/${userId}/settings`);
        if (isMounted) {
          const { selectedSources, selectedCategories, selectedAuthors } = res.data;
          const updatedSelectedSources = sources.filter((source) =>
            selectedSources.includes(source.source_id)
          );
          const updatedSelectedCategories = categories.filter((category) =>
            selectedCategories.includes(category.scat_id)
          );
          const updatedSelectedAuthors = authors.filter((author) =>
            selectedAuthors.includes(author.author_id)
          );
          setSelectedSources(updatedSelectedSources);
          setSelectedCategories(updatedSelectedCategories);
          setSelectedAuthors(updatedSelectedAuthors);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDetail();
    fetchUserSettings();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSaveSettings = () => {
    const updatedUserDetail = {
      ...userdetail,
      selectedSources: selectedSources.map((source) => source.source_id),
      selectedCategories: selectedCategories.map((category) => category.scat_id),
      selectedAuthors: selectedAuthors.map((author) => author.author_id),
    };

    http
      .post('/updateUser', updatedUserDetail)
      .then((res) => {
        setSaveStatus('Settings saved successfully');
        setShowModal(true);
      })
      .catch((error) => {
        setSaveStatus('Error saving settings');
        setShowModal(true);
        console.error(error);
      });
  };

  function renderElement() {
    if (userdetail) {
      return (
        <div className="user-details">
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <h4>Name</h4>
              <p>{userdetail.name}</p>
            </div>
            <div className="col-md-4">
              <h4>Email</h4>
              <p>{userdetail.email}</p>
            </div>
            <div className="col-md-4"></div>
          </div>
        </div>
      );
    } else {
      return <p>Loading.....</p>;
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="row text-center">
        <div className="col-sm-12 col-md-12">
          <h1 className="mb-4 mt-4">Dashboard Page</h1>
        </div>
      </div>
      {renderElement()}
      <div className="settings-form">
        <div className="row text-center">
          <div className="col-sm-12 col-md-12">
            <h3>Preferences</h3>
            <p>Adjust Settings For Personalized News Feeds</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-4">
            <div className="form-group">
              <h4>Authors:</h4>
              <div className="checkbox-group">
                {authors.map((author) => (
                  <div key={author.author_id} className="form-check">
                    <input
                      type="checkbox"
                      id={author.author_id}
                      value={author.author_id}
                      checked={selectedAuthors.some((a) => a.author_id === author.author_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAuthors([...selectedAuthors, author]);
                        } else {
                          setSelectedAuthors(selectedAuthors.filter((a) => a.author_id !== author.author_id));
                        }
                      }}
                      className="form-check-input"
                    />
                    <label htmlFor={author.author_id} className="form-check-label">
                      {author.authorName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4">
            <div className="form-group">
              <h4>Sources:</h4>
              <div className="checkbox-group">
                {sources.map((source) => (
                  <div key={source.source_id} className="form-check">
                    <input
                      type="checkbox"
                      id={source.source_id}
                      value={source.source_id}
                      checked={selectedSources.some((s) => s.source_id === source.source_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSources([...selectedSources, source]);
                        } else {
                          setSelectedSources(selectedSources.filter((s) => s.source_id !== source.source_id));
                        }
                      }}
                      className="form-check-input"
                    />
                    <label htmlFor={source.source_id} className="form-check-label">
                      {source.sourceName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4">
            <div className="form-group">
              <h4>Categories:</h4>
              <div className="checkbox-group">
                {categories.map((category) => (
                  <div key={category.scat_id} className="form-check">
                    <input
                      type="checkbox"
                      id={category.scat_id}
                      value={category.scat_id}
                      checked={selectedCategories.some((c) => c.scat_id === category.scat_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category]);
                        } else {
                          setSelectedCategories(selectedCategories.filter((c) => c.scat_id !== category.scat_id));
                        }
                      }}
                      className="form-check-input"
                    />
                    <label htmlFor={category.scat_id} className="form-check-label">
                      {category.categoryName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4"></div>
        </div>
        <br />
        <center>
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            Save Preferences And Settings
          </button>
        </center>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Save Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{saveStatus}</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
