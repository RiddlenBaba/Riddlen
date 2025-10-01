import { useRouter } from 'next/router';

export default function BottomNav() {
  const router = useRouter();

  const navItems = [
    { href: '/', icon: 'fas fa-home', label: 'Home' },
    { href: '/game', icon: 'fas fa-gamepad', label: 'Play' },
    { href: '/airdrop', icon: 'fas fa-gift', label: 'Airdrop' },
    { href: '/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { href: '/docs', icon: 'fas fa-book', label: 'Docs' }
  ];

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/' || router.pathname === '/landing';
    return router.pathname === href || router.pathname.startsWith(href);
  };

  return (
    <>
      <nav className="bottom-nav">
        <div className="nav-container">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`nav-button ${isActive(item.href) ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 215, 0, 0.2);
          z-index: 1000;
          box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.8);
          display: none;
        }

        .nav-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 80px;
          padding: 0 1rem;
          padding-bottom: env(safe-area-inset-bottom);
          max-width: 600px;
          margin: 0 auto;
        }

        .nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-button i {
          font-size: 24px;
          color: #FFD700;
          margin-bottom: 4px;
          transition: all 0.3s ease;
        }

        .nav-label {
          font-size: 11px;
          color: rgba(255, 215, 0, 0.7);
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          background: rgba(255, 215, 0, 0.1);
          border-color: rgba(255, 215, 0, 0.3);
          transform: translateY(-2px);
        }

        .nav-button:hover i {
          color: #FFA500;
          transform: scale(1.1);
        }

        .nav-button:hover .nav-label {
          color: #FFA500;
        }

        .nav-button.active {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          border-color: rgba(255, 215, 0, 0.6);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .nav-button.active i {
          color: #FFD700;
          transform: scale(1.15);
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .nav-button.active .nav-label {
          color: #FFD700;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .bottom-nav {
            display: block;
          }
        }
      `}</style>
    </>
  );
}