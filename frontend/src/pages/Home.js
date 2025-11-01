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

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Berbagi Kebaikan,<br />
            Menyebarkan Harapan
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform donasi barang yang menghubungkan kebaikan hati Anda dengan mereka yang membutuhkan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-donation"
              className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Mulai Donasi Sekarang
            </Link>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 border-2 border-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Mengapa DonasiBersama?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Kami mempermudah proses donasi barang untuk menciptakan dampak positif bagi masyarakat
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Mudah & Cepat</h3>
              <p className="text-gray-600">
                Proses donasi yang sederhana dan transparan, hanya dalam beberapa langkah
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Terpercaya</h3>
              <p className="text-gray-600">
                Bekerja sama dengan yayasan terpercaya untuk memastikan donasi tepat sasaran
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Dampak Nyata</h3>
              <p className="text-gray-600">
                Setiap donasi Anda memberikan dampak langsung kepada yang membutuhkan
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Yayasan Mitra Kami
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Berkolaborasi dengan yayasan terpercaya untuk menyalurkan donasi Anda
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Memuat yayasan...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                {error}
              </div>
            </div>
          ) : associations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Belum ada yayasan terdaftar
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {associations.map((association) => (
                <div
                  key={association.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{association.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{association.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start text-sm text-gray-500">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{association.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{association.phone}</span>
                      </div>
                    </div>
                    <Link
                      to="/create-donation"
                      className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Donasi Sekarang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Untuk Berbagi Kebaikan?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Bergabunglah dengan ribuan donatur lainnya dan mulai memberikan dampak positif hari ini
          </p>
          <Link
            to="/create-donation"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Mulai Donasi
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home