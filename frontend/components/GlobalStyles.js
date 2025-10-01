export default function GlobalStyles() {
  return (
    <style jsx global>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 30%, #16213e 70%, #0f0f0f 100%);
        min-height: 100vh;
      }

      #__next {
        min-height: 100vh;
        background: inherit;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #ffffff;
        line-height: 1.6;
        overflow-x: hidden;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .floating-riddles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
      }

      .floating-riddle {
        position: absolute;
        color: rgba(255, 215, 0, 0.1);
        font-size: 1.5rem;
        animation: float 8s ease-in-out infinite;
      }

      .floating-riddle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
      .floating-riddle:nth-child(2) { top: 60%; left: 80%; animation-delay: 2s; }
      .floating-riddle:nth-child(3) { top: 80%; left: 20%; animation-delay: 4s; }

      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
        50% { transform: translateY(-30px) rotate(180deg); opacity: 0.3; }
      }

      .header {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 215, 0, 0.1);
      }

      .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .logo {
        font-size: 1.8rem;
        font-weight: 800;
        background: linear-gradient(45deg, #FFD700, #FFA500, #FF6347);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        text-decoration: none;
      }

      .nav-links {
        display: flex;
        list-style: none;
        gap: 2rem;
        margin: 0;
        padding: 0;
      }

      .nav-links a {
        color: #ffffff;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        position: relative;
      }

      .nav-links a:hover {
        color: #FFD700;
      }

      .nav-links a::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(45deg, #FFD700, #FF6347);
        transition: width 0.3s ease;
      }

      .nav-links a:hover::after {
        width: 100%;
      }

      .social-icons-container {
        display: flex !important;
        align-items: center;
        gap: 0.75rem;
      }

      .social-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 215, 0, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.2);
        display: flex !important;
        align-items: center;
        justify-content: center;
        color: #FFD700 !important;
        font-size: 14px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        text-decoration: none;
      }

      .social-icon i {
        color: #FFD700 !important;
        font-size: 14px;
      }

      .social-icon:hover {
        background: rgba(255, 215, 0, 0.2);
        border-color: rgba(255, 215, 0, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(255, 215, 0, 0.2);
      }

      .social-icon:hover i {
        color: #FFA500 !important;
      }

      .connect-wallet-btn {
        background: linear-gradient(45deg, #FFD700, #FFA500);
        color: #000;
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
      }

      .connect-wallet-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
        background: linear-gradient(45deg, #FFA500, #FFD700);
      }

      .wallet-connected {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(255, 215, 0, 0.4);
        border-radius: 50px;
        padding: 0.65rem 1.25rem;
        backdrop-filter: blur(10px);
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
      }

      .wallet-connected:hover {
        background: rgba(255, 215, 0, 0.1);
        border-color: rgba(255, 215, 0, 0.6);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
      }

      .wallet-connected i {
        color: #FFD700;
        font-size: 0.8rem;
        transition: transform 0.3s ease;
      }

      .wallet-connected:hover i {
        transform: translateY(2px);
      }

      .wallet-indicator {
        width: 10px;
        height: 10px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse-wallet 2s ease-in-out infinite;
        box-shadow: 0 0 8px #10b981;
      }

      @keyframes pulse-wallet {
        0%, 100% { opacity: 1; box-shadow: 0 0 8px #10b981; }
        50% { opacity: 0.6; box-shadow: 0 0 15px #10b981; }
      }

      .wallet-address {
        font-size: 0.9rem;
        color: #FFD700;
        font-weight: 700;
        font-family: 'Courier New', monospace;
        letter-spacing: 0.5px;
      }

      .disconnect-btn {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 0.4rem 0.8rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .disconnect-btn:hover {
        background: rgba(239, 68, 68, 0.3);
        border-color: rgba(239, 68, 68, 0.5);
      }

      .footer {
        padding: 4rem 0 2rem;
        background: rgba(0, 0, 0, 0.4);
        border-top: 1px solid rgba(255, 215, 0, 0.1);
      }

      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 3rem;
        margin-bottom: 2rem;
      }

      .footer-section h3 {
        color: #FFD700;
        margin-bottom: 1rem;
        font-weight: 700;
      }

      .footer-section p, .footer-section a {
        color: #cccccc;
        text-decoration: none;
        margin-bottom: 0.5rem;
        display: block;
      }

      .footer-section a:hover {
        color: #FFD700;
      }

      .footer-bottom {
        text-align: center;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 215, 0, 0.1);
        color: #888;
      }

      @media (max-width: 768px) {
        .nav-links {
          display: none;
        }

        .nav {
          padding: 1rem;
          gap: 0.5rem;
        }

        .social-icon {
          width: 28px;
          height: 28px;
          font-size: 12px;
        }

        .social-icons-container {
          gap: 0.5rem;
        }
      }
    `}</style>
  );
}