import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Accommodations', to: '/accommodations' },
  { label: 'Things To Do', to: '/things-to-do' },
  { label: 'Attractions', to: '/attractions' },
  {
    label: 'Services',
    to: '/services',
    sub: [
      { label: 'Airbnb Management', to: '/manage' },
      { label: 'Cleaning Services', to: '/services' }
    ]
  },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(null);

  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);

    window.addEventListener('scroll', fn);

    return () => {
      window.removeEventListener('scroll', fn);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setDrop(null);
  }, [loc]);

  return (
    <>
      {/* TOP BAR */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
          background: '#0E1729',
          padding: '6px 0',
          fontSize: 11,
          color: 'rgba(255,255,255,0.78)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              📍
              <span className="topbar-address">
                Tower Isle, St. Mary, Jamaica | Near Ocho Rios
              </span>
            </span>

           
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#fff' }}
            >
              FB
            </a>

            <a
              href="https://instagram.com/sunsetretreatja"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#fff' }}
            >
              IG
            </a>

            <a
              href="https://wa.me/18762689319"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#fff' }}
            >
              WA
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <div
        style={{
          position: 'fixed',
          top: 30,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,.97)',
            backdropFilter: 'blur(10px)',
            boxShadow: scrolled
              ? '0 5px 30px rgba(0,0,0,.08)'
              : '0 1px 0 rgba(0,0,0,.05)',
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 78,
            }}
          >
            {/* LOGO IMAGE */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <img
                src="/logo.png"
                alt="Sunset Retreat"
                style={{
                  height: '58px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Link>

            {/* DESKTOP MENU */}
            <nav
              className="desktop-nav"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {NAV.map((link) => (
                <div
                  key={link.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() =>
                    link.sub && setDrop(link.label)
                  }
                  onMouseLeave={() => setDrop(null)}
                >
                  <Link
                    to={link.to}
                    style={{
                      padding: '10px',
                      color:
                        loc.pathname === link.to
                          ? '#C9933A'
                          : '#1A2540',
                      textDecoration: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {link.label}
                  </Link>

                  {drop === link.label &&
                    link.sub && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          background: '#fff',
                          minWidth: 220,
                          boxShadow:
                            '0 10px 30px rgba(0,0,0,.1)',
                        }}
                      >
                        {link.sub.map((s) => (
                          <Link
                            key={s.label}
                            to={s.to}
                            style={{
                              display: 'block',
                              padding: 14,
                              color: '#1A2540',
                              textDecoration: 'none',
                            }}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              <a
                href="https://www.airbnb.com/rooms/51519181"
                target="_blank"
                rel="noreferrer"
                style={{
                  marginLeft: 10,
                  background: '#C9933A',
                  color: '#fff',
                  padding: '10px 18px',
                  textDecoration: 'none',
                }}
              >
                📅 BOOK NOW
              </a>
            </nav>

            {/* HAMBURGER */}
            <button
              className="hamburger-btn"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div
            style={{
              background: '#fff',
            }}
          >
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.to}
                  style={{
                    display: 'block',
                    padding: 15,
                    color: '#1A2540',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>

                {item.sub?.map((s) => (
                  <Link
                    key={s.label}
                    to={s.to}
                    style={{
                      display: 'block',
                      padding: '12px 30px',
                      color: '#777',
                      textDecoration: 'none',
                    }}
                  >
                    → {s.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 108 }} />

      <style>{`
        .hamburger-btn{
          display:none;
          background:none;
          border:none;
          font-size:28px;
        }

        @media(max-width:1050px){
          .desktop-nav{
            display:none !important;
          }

          .hamburger-btn{
            display:block !important;
          }
        }

        @media(max-width:480px){
          .topbar-address{
            display:none;
          }

          img{
            height:48px !important;
          }
        }
      `}</style>
    </>
  );
}