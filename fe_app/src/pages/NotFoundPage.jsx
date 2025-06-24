import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound4Page = () => {
  const navigate = useNavigate();

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 30,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 5,
    }));
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-15),
        {
          id: Date.now(),
          left: Math.random() * 100,
          size: Math.random() * 25 + 25,
          delay: 0,
          duration: Math.random() * 3 + 4,
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found-container">
      <style>{`
        .not-found-container {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          background: transparent;
          padding: 60px 20px;
          overflow: hidden;
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          background: linear-gradient(135deg, #b79c60, #a88b4d, #7f6b33);
          border-radius: 50%;
          opacity: 0;
          animation: floatUp var(--duration) linear infinite;
          animation-delay: var(--delay);
          box-shadow: 0 0 10px rgba(168, 139, 77, 0.3);
        }

        @keyframes floatUp {
          0% {
            transform: translateY(100vh) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100px) scale(1.2);
            opacity: 0;
          }
        }

        .content-wrapper {
          text-align: center;
          z-index: 10;
          position: relative;
          max-width: 600px;
        }

        .wine-glass-container {
          position: relative;
          margin: 0 auto 40px;
          width: 180px;
          height: 220px;
        }

        .wine-glass {
          width: 100%;
          height: 100%;
          position: relative;
          animation: gentleShake 3s ease-in-out infinite;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .wine-glass:hover {
          transform: scale(1.05);
        }

        .glass-bowl {
          width: 140px;
          height: 160px;
          border: 3px solid rgba(168, 139, 77, 0.2);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(
            135deg,
            rgba(168, 139, 77, 0.1),
            rgba(168, 139, 77, 0.05),
            rgba(168, 139, 77, 0.1)
          );
          backdrop-filter: blur(5px);
          overflow: hidden;
        }

        .wine {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 55%;
          background: linear-gradient(45deg, #f7e7ce, #f1dba7, #a88b4d);
          border-radius: 0 0 50% 50%;
          animation: wineWave 4s ease-in-out infinite;
        }

        .glass-stem {
          width: 6px;
          height: 45px;
          background: rgba(168, 139, 77, 0.2);
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 3px;
        }

        .glass-base {
          width: 70px;
          height: 15px;
          background: rgba(168, 139, 77, 0.2);
          border-radius: 8px;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        @keyframes gentleShake {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-1deg);
          }
          75% {
            transform: rotate(1deg);
          }
        }

        @keyframes wineWave {
          0%,
          100% {
            transform: skewX(0deg);
            border-radius: 0 0 50% 50%;
          }
          50% {
            transform: skewX(1deg);
            border-radius: 0 0 45% 55%;
          }
        }

        .error-code {
          font-size: 6rem;
          font-weight: bold;
          color: #a88b4d;
          text-shadow: 0 0 20px rgba(168, 139, 77, 0.4);
          margin-bottom: 20px;
        }

        .error-title {
          font-size: 2rem;
          color: #a88b4d;
          margin-bottom: 20px;
        }

        .error-message {
          font-size: 1.1rem;
          color: rgba(168, 139, 77, 0.8);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 20px rgba(168, 139, 77, 0.4);
          }
          to {
            text-shadow: 0 0 30px rgba(168, 139, 77, 0.7),
              0 0 40px rgba(168, 139, 77, 0.3);
          }
        }

        /* Bottone rimosso perché useremo classe btn btn-outline-light esterna */

        .floating-icons {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-icon {
          position: absolute;
          color: rgba(168, 139, 77, 0.4);
          font-size: 1.5rem;
          animation: floatIcon 10s linear infinite;
        }

        .floating-icon:nth-child(1) {
          left: 15%;
          animation-delay: 0s;
        }
        .floating-icon:nth-child(2) {
          left: 35%;
          animation-delay: 3s;
        }
        .floating-icon:nth-child(3) {
          left: 65%;
          animation-delay: 6s;
        }
        .floating-icon:nth-child(4) {
          left: 85%;
          animation-delay: 9s;
        }

        @keyframes floatIcon {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .not-found-container {
            min-height: 60vh;
            padding: 40px 15px;
          }

          .error-code {
            font-size: 4rem;
          }

          .error-title {
            font-size: 1.5rem;
          }

          .error-message {
            font-size: 1rem;
          }

          .wine-glass-container {
            width: 150px;
            height: 180px;
          }

          .glass-bowl {
            width: 120px;
            height: 140px;
          }
        }
      `}</style>

      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              "--delay": `${particle.delay}s`,
              "--duration": `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="floating-icons">
        <i className="floating-icon fas fa-wine-glass-alt"></i>
      </div>

      <div className="content-wrapper">
        <div className="wine-glass-container" title="Calice di vino animato">
          <div className="wine-glass" aria-label="Calice di vino animato">
            <div className="glass-bowl">
              <div className="wine"></div>
            </div>
            <div className="glass-stem"></div>
            <div className="glass-base"></div>
          </div>
        </div>

        <div
          className="error-code"
          aria-label="Errore 404, pagina non trovata"
          role="heading"
          aria-level={1}
        >
          404
        </div>
        <div className="error-title" role="heading" aria-level={2}>
          Page not found
        </div>
        <div className="error-message">
          We're sorry. It looks like the page you're looking for doesn't exist.<br></br>
          Get back to home page and try again.
        </div>

        <button
          type="button"
          className="btn btn-outline-light"
          onClick={handleGoHome}
          aria-label="Torna alla homepage"
        >
          Get back
        </button>
      </div>
    </div>
  );
};

export default NotFound4Page;
