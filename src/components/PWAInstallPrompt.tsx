import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const hasBeenPrompted = localStorage.getItem('pwa-install-prompted');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone || hasBeenPrompted) {
      setIsInstalled(true);
      return;
    }

    const showManualTimer = setTimeout(() => {
      if (!hasBeenPrompted) {
        setShowPrompt(true);
      }
    }, 3000);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      clearTimeout(showManualTimer);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(showManualTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      localStorage.setItem('pwa-install-prompted', 'true');
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-prompted', 'true');
    setShowPrompt(false);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-2.5">
              <Download className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex-1 pr-4">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Instale nosso App!
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Acesso rápido e experiência melhor.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium"
              >
                Agora não
              </button>
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded hover:from-cyan-700 hover:to-blue-700 transition-all font-medium shadow-md"
              >
                Instalar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
