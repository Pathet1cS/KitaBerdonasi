import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const response = await fetch('http://localhost:5000/associations');
        const data = await response.json();
        setAssociations(data);
      } catch (err) {
        setError('Failed to load associations');
      } finally {
        setLoading(false);
      }
    };

    fetchAssociations();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di DonasiBersama</h1>
        <p className="text-xl text-gray-600">
          Platform donasi barang untuk membantu sesama yang membutuhkan
        </p>
        <Link
          to="/create-donation"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Mulai Donasi
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {associations.map((association) => (
          <div key={association.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{association.name}</h3>
              <p className="text-gray-600 mb-4">{association.description}</p>
              <div className="text-sm text-gray-500">
                <p>
                  <strong>Alamat:</strong> {association.address}
                </p>
                <p>
                  <strong>Telepon:</strong> {association.phone}
                </p>
              </div>
              <Link
                to="/create-donation"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Donasi ke {association.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home