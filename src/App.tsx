import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LogoProvider } from './contexts/LogoContext';
import { ToastProvider } from './contexts/ToastContext';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { isSupabaseConfigured } from './lib/supabase';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './pages/admin/Products';
import Services from './pages/admin/Services';
import Clients from './pages/admin/Clients';
import Vendors from './pages/admin/Vendors';
import Financial from './pages/admin/Financial';
import Reports from './pages/admin/Reports';
import Schedule from './pages/admin/Schedule';
import Quotations from './pages/admin/Quotations';
import Sales from './pages/admin/Sales';
import DatabaseCheck from './pages/admin/DatabaseCheck';
import Maintenance from './pages/admin/Maintenance';
import VendorQuotations from './pages/VendorQuotations';

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuração Necessária</h1>
            <p className="text-gray-600">O banco de dados Supabase precisa ser configurado</p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  As variáveis de ambiente do Supabase não foram detectadas ou estão inválidas.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Passos para configurar:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Acesse <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">app.supabase.com</a> e crie um projeto</li>
                <li>Copie a URL do projeto e a chave anon</li>
                <li>Atualize o arquivo <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env</code> com as credenciais corretas</li>
                <li>Execute as migrations do banco de dados conforme o arquivo <code className="bg-gray-100 px-2 py-1 rounded text-sm">SETUP_DATABASE.md</code></li>
                <li>Recarregue esta página</li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Formato do arquivo .env:</h3>
              <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui`}
              </pre>
            </div>

            <div className="flex items-center justify-center pt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <LogoProvider>
            <PWAInstallPrompt />
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute role="admin">
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute role="admin">
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <ProtectedRoute role="admin">
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vendors"
              element={
                <ProtectedRoute role="admin">
                  <Vendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/financial"
              element={
                <ProtectedRoute role="admin">
                  <Financial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute role="admin">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schedule"
              element={
                <ProtectedRoute role="admin">
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quotations"
              element={
                <ProtectedRoute role="admin">
                  <Quotations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sales"
              element={
                <ProtectedRoute role="admin">
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/database-check"
              element={
                <ProtectedRoute role="admin">
                  <DatabaseCheck />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/maintenance"
              element={
                <ProtectedRoute role="admin">
                  <Maintenance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor"
              element={
                <ProtectedRoute role="vendor">
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/quotations"
              element={
                <ProtectedRoute role="vendor">
                  <VendorQuotations />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </LogoProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;