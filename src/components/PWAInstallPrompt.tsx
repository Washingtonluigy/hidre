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
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  useEffect(() => {
    const hasBeenPrompted = localStorage.getItem('pwa-install-prompted');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isStandalone || hasBeenPrompted) {
      setIsInstalled(true);
      return;
    }

    // Mostrar prompt manual para iOS ou após 3 segundos se não houver evento
    const showManualTimer = setTimeout(() => {
      if (!deferredPrompt && !hasBeenPrompted) {
        setShowManualInstructions(true);
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
  }, [deferredPrompt]);

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

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <Dialog.Root open={showPrompt} onOpenChange={setShowPrompt}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90vw] max-w-[500px] z-[9999] shadow-2xl max-h-[90vh] overflow-y-auto">
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
              <ul className="space-y-2 text-sm text-gray-700 text-left">
                <li className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-cyan-600 flex-shrink-0" />
                  Acesso rápido direto da tela inicial
                </li>
                <li className="flex items-center">
                  <Monitor className="h-4 w-4 mr-2 text-cyan-600 flex-shrink-0" />
                  Funciona offline
                </li>
                <li className="flex items-center">
                  <Download className="h-4 w-4 mr-2 text-cyan-600 flex-shrink-0" />
                  Atualizações automáticas
                </li>
              </ul>
            </div>

            {showManualInstructions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-blue-900 mb-3 text-sm">
                  📱 Como Instalar:
                </h4>
                {isIOS ? (
                  <ol className="space-y-2 text-xs text-blue-800">
                    <li className="flex items-start">
                      <span className="font-bold mr-2">1.</span>
                      <span>Toque no botão de compartilhar (□↑) na barra inferior do Safari</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">2.</span>
                      <span>Role para baixo e toque em "Adicionar à Tela de Início"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">3.</span>
                      <span>Toque em "Adicionar" no canto superior direito</span>
                    </li>
                  </ol>
                ) : (
                  <ol className="space-y-2 text-xs text-blue-800">
                    <li className="flex items-start">
                      <span className="font-bold mr-2">1.</span>
                      <span>Toque no menu (⋮) do navegador no canto superior direito</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">2.</span>
                      <span>Selecione "Adicionar à tela inicial" ou "Instalar aplicativo"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">3.</span>
                      <span>Confirme tocando em "Adicionar" ou "Instalar"</span>
                    </li>
                  </ol>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Agora não
              </button>
              {deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all font-medium shadow-lg"
                >
                  Instalar
                </button>
              )}
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
