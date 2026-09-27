import { useEffect, useRef, useState } from 'react';

// Camera QR reader. Decodes in the page with jsqr; nothing leaves the device.
export default function QrScanner({ onResult, onClose }) {
  const video = useRef(null);
  const canvas = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream, raf, jsQR, stopped = false;
    (async () => {
      try {
        jsQR = (await import('jsqr')).default;
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (stopped) { stream.getTracks().forEach((t) => t.stop()); return; }
        video.current.srcObject = stream;
        await video.current.play();
        const ctx = canvas.current.getContext('2d', { willReadFrequently: true });
        const tick = () => {
          if (stopped) return;
          const v = video.current;
          if (v && v.readyState === v.HAVE_ENOUGH_DATA) {
            canvas.current.width = v.videoWidth; canvas.current.height = v.videoHeight;
            ctx.drawImage(v, 0, 0);
            const img = ctx.getImageData(0, 0, canvas.current.width, canvas.current.height);
            const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
            if (code?.data) { onResult(code.data); return; }
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch (e) {
        setError(e?.name === 'NotAllowedError' ? 'Camera permission was refused. You can paste the code instead.' : (e?.message || 'Camera unavailable.'));
      }
    })();
    return () => { stopped = true; if (raf) cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [onResult]);

  return (
    <div className="scan">
      <video ref={video} playsInline muted />
      <canvas ref={canvas} hidden />
      <div className="frame" />
      {error && <p className="notice warn">{error}</p>}
      <button className="btn small" onClick={onClose}>Cancel</button>
      <style jsx>{`
        .scan { position: relative; display: flex; flex-direction: column; gap: 10px; align-items: center; }
        video { width: 100%; max-width: 420px; border-radius: 14px; background: #000; aspect-ratio: 3 / 4; object-fit: cover; }
        .frame { position: absolute; top: 12%; left: 50%; transform: translateX(-50%); width: 60%; max-width: 250px; aspect-ratio: 1; border: 2px solid var(--accent); border-radius: 12px; pointer-events: none; }
        p { margin: 0; }
      `}</style>
    </div>
  );
}
