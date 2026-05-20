import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/endpoints';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const hasRun = useRef(false);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState('Đang xác minh...');

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
      console.error('Missing token or userId in URL');
      setError('Thiếu thông tin xác minh từ Google');
      setTimeout(() => navigate('/login?error=google_auth_failed'), 2000);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoadingText('Đang đăng nhập...');
        localStorage.setItem('token', token);
        const response = await authApi.getMe();
        // Response structure after axios interceptor: { success: true, data: { user } }
        const userData = response?.data?.user;

        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          window.dispatchEvent(new Event('storage'));
          setLoadingText('Đăng nhập thành công!');
          setTimeout(() => navigate('/'), 1000);
        } else {
          console.error('Invalid response:', response);
          throw new Error('Không nhận được dữ liệu người dùng');
        }
      } catch (error) {
        console.error('Google auth fetch user error:', error);
        setError(error.message || 'Đăng nhập Google thất bại');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login?error=google_auth_failed'), 3000);
      }
    };

    fetchUser();
  }, [searchParams, navigate]);

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
