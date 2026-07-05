import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * Custom hook for QR code scanning using html5-qrcode
 * @param {Function} onScanSuccess - Callback when QR code is successfully scanned
 * @param {Function} onScanError - Optional callback for scan errors
 * @returns {Object} Scanner controls and state
 */
const useQRScanner = (onScanSuccess, onScanError = null) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Prevent double initialization in strict mode
  useEffect(() => {
    isInitializedRef.current = true;
    
    return () => {
      isInitializedRef.current = false;
      
      // Cleanup scanner on unmount
      const scanner = html5QrCodeRef.current;
      if (scanner) {
        scanner.stop()
          .catch(() => {
            // Ignore errors during cleanup
          })
          .finally(() => {
            // Clear the DOM manually
            const container = document.getElementById('qr-reader');
            if (container) {
              container.innerHTML = '';
            }
            html5QrCodeRef.current = null;
          });
      }
    };
  }, []);

  const startScanner = useCallback(async () => {
    if (!isInitializedRef.current) {
      return;
    }

    // If already has an instance, stop it first
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        const container = document.getElementById('qr-reader');
        if (container) {
          container.innerHTML = '';
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      html5QrCodeRef.current = null;
    }

    try {
      setError(null);

      // Create new scanner instance
      const scanner = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = scanner;

      const qrCodeSuccessCallback = (decodedText) => {
        if (!isInitializedRef.current) return;
        
        // Stop scanner after successful scan
        stopScanner();
        onScanSuccess(decodedText);
      };

      const qrCodeErrorCallback = (errorMessage) => {
        // This is called frequently during scanning
        if (onScanError && isInitializedRef.current) {
          onScanError(errorMessage);
        }
      };

      // Configuration for the scanner
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      // Start scanning
      await scanner.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );

      if (isInitializedRef.current) {
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Error starting scanner:', err);
      
      if (!isInitializedRef.current) return;

      // Handle specific error types
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please use manual verification.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is in use by another application.');
      } else {
        setError('Failed to start camera. Please try again.');
      }
      
      setIsScanning(false);
      html5QrCodeRef.current = null;
    }
  }, [onScanSuccess, onScanError]);

  const stopScanner = useCallback(async () => {
    const scanner = html5QrCodeRef.current;
    if (!scanner) {
      return;
    }

    try {
      await scanner.stop();
      
      // Clear the container
      const container = document.getElementById('qr-reader');
      if (container) {
        container.innerHTML = '';
      }
      
      html5QrCodeRef.current = null;
      
      if (isInitializedRef.current) {
        setIsScanning(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error stopping scanner:', err);
      
      if (isInitializedRef.current) {
        setIsScanning(false);
      }
    }
  }, []);

  const toggleScanner = useCallback(() => {
    if (isScanning) {
      stopScanner();
    } else {
      startScanner();
    }
  }, [isScanning, startScanner, stopScanner]);

  return {
    isScanning,
    error,
    startScanner,
    stopScanner,
    toggleScanner,
  };
};

export default useQRScanner;
