import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import './EditTrip.css';

const TripEditForm = () => {
  const { id } = useParams(); // Get trip ID from URL params
  const [trip, setTrip] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: {
      overview: '',
      aboutYou: '',
      accommodation: '',
      inclusions: [],
      exclusions: [],
    },
    location: '',
    price: '',
    departureDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to edit trip details');
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTrip(data);
          setFormData({
            title: data.title,
            description: {
              overview: data.description.overview,
              aboutYou: data.description.aboutYou,
              accommodation: data.description.accommodation,
              inclusions: data.description.inclusions.join(', '),
              exclusions: data.description.exclusions.join(', '),
            },
            location: data.location,
            price: data.price,
            departureDate: new Date(data.departureDate).toISOString().split('T')[0], // Format for input type="date"
          });
          setLoading(false);
        } else {
          setError('Error fetching trip details');
          setLoading(false);
        }
      } catch (err) {
        setError('Error fetching trip details');
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('description.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      return setError('You must be logged in to edit trip details');
    }

    try {
      const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          ...formData,
          description: {
            ...formData.description,
            inclusions: formData.description.inclusions.split(',').map((item) => item.trim()),
            exclusions: formData.description.exclusions.split(',').map((item) => item.trim()),
          },
        }),
      });

      if (res.ok) {
        alert('Trip updated successfully');
        navigate(`/trips/${id}`); // Navigate back to trip details page
      } else {
        setError('Error updating trip');
      }
    } catch (err) {
      setError('Error updating trip');
    }
  };

  if (loading) {
    return <p>Loading trip details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="edit-trip">
      <h1>Edit Trip</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Overview:
          <textarea
            name="description.overview"
            value={formData.description.overview}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          About the Host:
          <textarea
            name="description.aboutYou"
            value={formData.description.aboutYou}
            onChange={handleChange}
          />
        </label>
        <label>
          Accommodation:
          <textarea
            name="description.accommodation"
            value={formData.description.accommodation}
            onChange={handleChange}
          />
        </label>
        <label>
          Inclusions (comma-separated):
          <input
            type="text"
            name="description.inclusions"
            value={formData.description.inclusions}
            onChange={handleChange}
          />
        </label>
        <label>
          Exclusions (comma-separated):
          <input
            type="text"
            name="description.exclusions"
            value={formData.description.exclusions}
            onChange={handleChange}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Departure Date:
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default TripEditForm;
