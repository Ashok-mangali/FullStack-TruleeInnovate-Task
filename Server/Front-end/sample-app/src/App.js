import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [updateId, setUpdateId] = useState(null);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActions, setShowActions] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [experienceRange, setExperienceRange] = useState({ min: '', max: '' });

  const allExperiences = ['1 year', '2 years', '3 years', '5 years', '10+ years'];
  const allSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users'); //fetch the Data 
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'Experience') {
      setFilteredExperiences(
        allExperiences.filter((exp) =>
          exp.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else if (name === 'Skill') {
      setFilteredSkills(
        allSkills.filter((skill) =>
          skill.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleSuggestionClick = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (name === 'Experience') {
      setFilteredExperiences([]);
    } else if (name === 'Skill') {
      setFilteredSkills([]);
    }
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:3001/users/${id}`, formData);
        const updatedData = data.map((item) => (item._id === id ? { ...item, ...formData } : item));
        setData(updatedData);
        setUpdateId(null);
      } else {
        await axios.post('http://localhost:3001/users/add', formData);
        fetchData();
      }
      setFormData({});
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error adding/updating data: ', error);
    }
  };

  const handleEdit = (id) => {
    const selectedData = data.find((item) => item._id === id);
    setFormData(selectedData);
    setUpdateId(id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting data: ', error);
    }
  };

  const handleShowActions = (id) => {
    setShowActions(showActions === id ? null : id);
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setExperienceRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  const filteredData = data.filter((item) =>
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.Phone && item.Phone.toString().includes(searchTerm)) ||
    (item.Email && item.Email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="App">
      <h1 className='d-flex justify-content-start m-2'>Candidate</h1>

      <div className='d-flex justify-content-end m-3'>
        <button className='btn btn-primary'
          onClick={() => {
            setIsFormVisible(true);
            setFormData({});
            setUpdateId(null);
          }}
        >
          Add
        </button>
      </div>

      <br />
      <div className='d-flex justify-content-center'>
        <input
          type="text"
          placeholder="Search by candidate, Phone, or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ color: 'black', margin: '10px', fontWeight: 'bold', width: '30%', textAlign: "start" }}

        />
        <div className='d-flex justify-content-center m-4'>
          <i
            className="fa fa-filter"
            onClick={() => setShowFilter(!showFilter)}
            style={{
              fontSize: '20px',
              color: 'black',
            }}
          ></i>
        </div>
      </div>

      {showFilter && (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Experience Range:</label>
            <div>
              <input
                type="number"
                placeholder="Min"
                name="min"
                value={experienceRange.min}
                onChange={handleExperienceChange}
                style={{ padding: '5px', marginRight: '10px' }}
              />
              <input
                type="number"
                placeholder="Max"
                name="max"
                value={experienceRange.max}
                onChange={handleExperienceChange}
                style={{ padding: '5px' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Skills:</label>
            <input
              type="text"
              placeholder="Filter skills"
              onChange={(e) => handleChange(e)}
              style={{ padding: '5px', width: '100%' }}
            />
            {filteredSkills.length > 0 && (
              <ul>
                {filteredSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {isFormVisible && (
        <form onSubmit={(e) => handleSubmit(e, updateId)}>
          <input
            style={{ color: 'black', margin: '5px', padding: '7px', fontWeight: 'bold' }}
            type="text"
            placeholder="Enter Your Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
          />
          <input
            style={{ color: 'black', margin: '5px', padding: '7px', fontWeight: 'bold' }}
            type="number"
            placeholder="Enter Your Number"
            name="Phone"
            value={formData.Phone || ''}
            onChange={handleChange}
          />
          <input
            style={{ color: 'black', margin: '5px', padding: '7px', fontWeight: 'bold' }}
            type="text"
            placeholder="Enter Your Email"
            name="Email"
            value={formData.Email || ''}
            onChange={handleChange}
          />
          <select
            style={{ color: 'black', margin: '5px', padding: '7px', fontWeight: 'bold' }}
            name="Gender"
            value={formData.Gender || ''}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            style={{ color: 'black', margin: '5px', padding: '7px', fontWeight: 'bold' }}
            type="text"
            placeholder="Enter Your Experience"
            name="Experience"
            value={formData.Experience || ''}
            onChange={handleChange}
          />
          {filteredExperiences.length > 0 && (
            <ul className="suggestions">
              {filteredExperiences.map((exp, index) => (
                <li key={index} onClick={() => handleSuggestionClick('Experience', exp)}>
                  {exp}
                </li>
              ))}
            </ul>
          )}

          <input
            style={{ color: 'black', margin: '5px', padding: '7px', fontWeight: 'bold' }}
            type="text"
            placeholder="Enter Your Skills"
            name="Skill"
            value={formData.Skill || ''}
            onChange={handleChange}
          />
          {filteredSkills.length > 0 && (
            <ul className="suggestions">
              {filteredSkills.map((skill, index) => (
                <li key={index} onClick={() => handleSuggestionClick('Skill', skill)}>
                  {skill}
                </li>
              ))}
            </ul>
          )}

          <button
            style={{ backgroundColor: 'lightblue', color: 'black', margin: '5px', padding: '8px' }}
            type="submit"
          >
            {updateId ? 'Update' : 'Add'}
          </button>

          <button
            type="button"
            onClick={() => setIsFormVisible(false)}
            style={{
              marginLeft: '10px',
              backgroundColor: 'red',
              color: 'black',
              padding: '8px',
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', backgroundColor: 'lightblue' }}>Name</th>
            <th style={{ padding: '10px', backgroundColor: 'lightblue' }}>Phone</th>
            <th style={{ padding: '10px', backgroundColor: 'lightblue' }}>Email</th>
            <th style={{ padding: '10px', backgroundColor: 'lightblue' }}>Gender</th>
            <th style={{ padding: '10px', backgroundColor: 'lightblue' }}>Experience</th>
            <th style={{ padding: '10px', backgroundColor: 'lightblue' }}>Skill</th>
            <th style={{ padding: '10px', backgroundColor: 'lightblue' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td style={{ padding: '10px' }}>{item.name}</td>
              <td style={{ padding: '10px' }}>{item.Phone}</td>
              <td style={{ padding: '10px' }}>{item.Email}</td>
              <td style={{ padding: '10px' }}>{item.Gender}</td>
              <td style={{ padding: '10px' }}>{item.Experience}</td>
              <td style={{ padding: '10px' }}>{item.Skill}</td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => handleShowActions(item._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: "bold" }}
                >
                  ...
                </button>
                {showActions === item._id && (
                  <div>
                    <button onClick={() => handleEdit(item._id)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)} style={{ marginLeft: '5px' }}>
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
