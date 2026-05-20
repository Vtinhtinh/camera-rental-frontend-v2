import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot apiUrl={API_URL} />
    </div>
  );
};

export default Layout;
