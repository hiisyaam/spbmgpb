import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Sandbox from './pages/Sandbox';
import Layout from './components/Layout';
import OfflineBanner from './components/OfflineBanner';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <OfflineBanner />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn/:algorithm" element={<Learn />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" />
    </Router>
  );
}
