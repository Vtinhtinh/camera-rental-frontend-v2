import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/endpoints';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasRun = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState('Đang xác minh...');

  useEffect(() => {
    setMounted(true);
    setLoadingText('Đang đăng nhập...');

    if (hasRun.current) return;
    hasRun.current = true;

    const processAuth = async () => {
      try {
        setLoadingText('Đang đăng nhập...');

        // Backend đã set cookie HTTP-only, gọi /auth/me để lấy user info
        const response = await authApi.getMe();
        const userData = response?.data?.user;

        if (userData) {
          // Lưu vào localStorage để AuthContext nhận biết
          localStorage.setItem('user', JSON.stringify(userData));
          setLoadingText('Đăng nhập thành công!');
          // Reload để AuthContext init với cookie
          window.location.href = '/';
        } else {
          throw new Error('Không nhận được dữ liệu người dùng');
        }
      } catch (error) {
        console.error('Google auth error:', error);
        setError(error.message || 'Đăng nhập Google thất bại');
        setTimeout(() => navigate('/login?error=google_auth_failed'), 3000);
      }
    };

    processAuth();
  }, [navigate]);

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Đang xác minh...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-400 text-lg">{error}</p>
            <p className="text-gray-500 text-sm mt-2">Đang chuyển hướng về trang đăng nhập...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">{loadingText}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleSuccess;
