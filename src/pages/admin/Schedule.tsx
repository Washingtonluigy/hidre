import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '../../components/Calendar';
import { ArrowLeft } from 'lucide-react';

function Schedule() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin')}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          </div>
        </div>

        <Calendar />
      </div>
    </div>
  );
}

export default Schedule;