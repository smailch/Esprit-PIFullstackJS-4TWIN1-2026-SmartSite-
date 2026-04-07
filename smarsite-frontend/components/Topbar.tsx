'use client';

import { Bell, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  fullName?: string;
  email?: string;
  profileImage?: string;
}

export default function Topbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ✅ Récupérer le user depuis le token JWT
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Fallback immédiat depuis le token
    setUser({
      fullName: payload.fullName || payload.name || payload.username,
      email: payload.email,
      profileImage: payload.profileImage,
    });


    // ✅ Appel API pour récupérer la vraie profileImage
    fetch(`http://localhost:3200/users/${payload.sub}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUser({
          fullName: data.fullName,
          email: data.email,
          profileImage: data.profileImage, // ✅ image depuis MongoDB
        });
      })
      .catch(() => {}); // garde le fallback token si API échoue

  } catch {
    localStorage.removeItem('token');
    router.push('/login');
  }
}, []);

  // ✅ Fermer dropdown si clic dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      <style>{`
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .dd-item:hover   { background-color:#f4f6fb !important; }
        .dd-logout:hover { background-color:#fef2f2 !important; color:#dc2626 !important; }
        .avatar-btn:hover .avatar-overlay { opacity:1 !important; }
      `}</style>

      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 md:px-8">

          <div className="hidden md:block" />

          <div className="flex items-center gap-4 ml-auto">

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell size={20} className="text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Settings size={20} className="text-foreground" />
            </button>

            {/* Nom + Email */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#132849' }}>
                {user?.fullName ?? '...'}
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>
                {user?.email ?? ''}
              </div>
            </div>

            {/* Avatar + Dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                className="avatar-btn"
                onClick={() => setShowUserMenu(v => !v)}
                style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  border: '2px solid #FACC15', cursor: 'pointer',
                  overflow: 'hidden', position: 'relative',
                  backgroundColor: '#132849', padding: 0,
                  transition: 'transform 0.2s',
                }}
              >
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '15px', fontWeight: '800', color: '#FACC15',
                  }}>
                    {initials}
                  </div>
                )}
                <div className="avatar-overlay" style={{
                  position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '14px', opacity: 0, transition: 'opacity 0.2s',
                }}>✏️</div>
                <div style={{
                  position: 'absolute', bottom: '1px', right: '1px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  backgroundColor: '#22c55e', border: '2px solid white',
                }} />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: '240px', backgroundColor: 'white',
                  borderRadius: '14px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                  overflow: 'hidden', animation: 'dropIn 0.2s ease',
                  border: '1px solid #eee', zIndex: 50,
                }}>

                  {/* Header dropdown */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px', backgroundColor: '#132849',
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: '#1e3a5f', border: '2px solid #FACC15',
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      overflow: 'hidden', flexShrink: 0,
                    }}>
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="avatar"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#FACC15' }}>
                          {initials}
                        </span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>
                        {user?.fullName ?? '...'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
                        {user?.email ?? ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: '#f0f0f0' }} />

                  {/* Profil */}
                  <button
                    className="dd-item"
                    onClick={() => { setShowUserMenu(false); router.push('/profile'); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      width: '100%', padding: '12px 16px',
                      border: 'none', backgroundColor: 'white',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'background-color 0.15s', color: '#333',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>👤</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>Edit profil</div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Informations, password</div>
                    </div>
                  </button>

                  <div style={{ height: '1px', backgroundColor: '#f0f0f0' }} />

                  {/* Logout */}
                  <button
                    className="dd-logout"
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      width: '100%', padding: '12px 16px',
                      border: 'none', backgroundColor: 'white',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'background-color 0.15s', color: '#ef4444',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>🚪</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>Logout</div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Close session</div>
                    </div>
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}