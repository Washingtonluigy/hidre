import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

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

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
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
    <Dialog.Root open={showPrompt} onOpenChange={setShowPrompt}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90vw] max-w-[450px] z-[9999] shadow-2xl">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-4">
                <Download className="h-8 w-8 text-white" />
              </div>
            </div>

            <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">
              Instale nosso App!
            </Dialog.Title>

            <Dialog.Description className="text-gray-600 mb-6">
              Instale o Sistema de Gestão no seu dispositivo para ter acesso rápido e uma melhor experiência.
            </Dialog.Description>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Benefícios:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-cyan-600" />
                  Acesso rápido direto da tela inicial
                </li>
                <li className="flex items-center">
                  <Monitor className="h-4 w-4 mr-2 text-cyan-600" />
                  Funciona offline
                </li>
                <li className="flex items-center">
                  <Download className="h-4 w-4 mr-2 text-cyan-600" />
                  Atualizações automáticas
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Agora não
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all font-medium shadow-lg"
              >
                Instalar
              </button>
            </div>
          </div>

          <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
