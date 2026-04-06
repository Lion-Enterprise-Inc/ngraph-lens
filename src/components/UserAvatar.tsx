import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function UserAvatar() {
  const { user, isLoggedIn } = useApp();
  const navigate = useNavigate();

  if (isLoggedIn && user) {
    return (
      <button className="user-avatar-btn" onClick={() => navigate('/mypage')}>
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="" className="user-avatar-img" />
        ) : (
          <div className="user-avatar-placeholder">
            {(user.display_name || '?')[0]}
          </div>
        )}
      </button>
    );
  }

  return (
    <button className="user-avatar-btn login-btn" onClick={() => navigate('/login')}>
      <User size={20} />
    </button>
  );
}
