import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const { setCapturedImage } = useApp();
  const navigate = useNavigate();

  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // camera not available
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [facingMode, startCamera]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          setCapturedImage(file);
          streamRef.current?.getTracks().forEach(t => t.stop());
          navigate('/result');
        }
      },
      'image/jpeg',
      0.92
    );
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedImage(file);
      streamRef.current?.getTracks().forEach(t => t.stop());
      navigate('/result');
    }
  };

  const handleClose = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    navigate('/');
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="camera-page">
      <video
        ref={videoRef}
        className="camera-video"
        autoPlay
        playsInline
        muted
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="camera-overlay">
        <div className="camera-top-bar">
          <button className="camera-close-btn" onClick={handleClose}>
            <X size={22} />
          </button>
          <div />
        </div>

        <div className="camera-guide">
          <div className="camera-guide-frame">
            <div className="camera-corner tl" />
            <div className="camera-corner tr" />
            <div className="camera-corner bl" />
            <div className="camera-corner br" />
            <span className="camera-guide-label">MENU SCAN</span>
          </div>
        </div>

        <div className="camera-bottom-bar">
          <button className="camera-gallery-btn" onClick={() => fileRef.current?.click()}>
            <ImageIcon size={22} />
          </button>
          <button className="camera-shutter-btn" onClick={capture}>
            <div className="camera-shutter-inner" />
          </button>
          <button className="camera-flip-btn" onClick={flipCamera}>
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="camera-hidden-input"
        onChange={handleFile}
      />
    </div>
  );
}
