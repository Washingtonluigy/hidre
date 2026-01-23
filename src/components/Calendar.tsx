import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useVisitStore, VisitStatus } from '../store/visits';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Phone, MapPin, Package, CreditCard, Calendar as CalendarIcon, Check } from 'lucide-react';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  vendorId?: string;
  onEventSelect?: (event: any) => void;
}

export function Calendar({ vendorId, onEventSelect }: CalendarProps) {
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [showVisitDetails, setShowVisitDetails] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<VisitStatus>('scheduled');
  const [notes, setNotes] = useState('');

  const { visits, getVisitsByVendor, syncWithSupabase, updateVisit } = useVisitStore();

  useEffect(() => {
    // Sync visits with Supabase when component mounts
    syncWithSupabase();

    // Auto-refresh visits every 5 seconds
    const intervalId = setInterval(() => {
      syncWithSupabase();
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [syncWithSupabase]);

  // Filter visits based on vendorId if provided, otherwise use all visits
  const filteredVisits = vendorId 
    ? visits.filter(visit => visit.vendorId === vendorId)
    : visits;

  const events = filteredVisits.map(visit => ({
    id: visit.id,
    title: `${visit.clientName}`,
    start: new Date(visit.scheduledDate),
    end: new Date(new Date(visit.scheduledDate).getTime() + 60 * 60 * 1000), // 1 hour duration
    visit: visit,
  }));

  const handleEventSelect = (event: any) => {
    if (event.visit) {
      setSelectedVisit(event.visit);
      setNewStatus(event.visit.status);
      setNotes(event.visit.notes || '');
      setEditingStatus(false);
      setShowVisitDetails(true);
    }

    // Call the optional onEventSelect prop if provided
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedVisit) return;

    await updateVisit(selectedVisit.id, {
      status: newStatus,
      notes: notes
    });

    setEditingStatus(false);
    setShowVisitDetails(false);
    syncWithSupabase();
  };

  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: '2px solid #1e40af',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        padding: '4px 8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    };
  };

  const slotStyleGetter = () => {
    return {
      style: {
        color: 'white',
        border: 'none',
      }
    };
  };

  return (
    <div className="h-[600px] bg-white rounded-lg shadow-md p-4">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="pt-BR"
        onSelectEvent={handleEventSelect}
        eventPropGetter={eventStyleGetter}
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
          date: "Data",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "Não há eventos neste período.",
        }}
      />

      <Dialog.Root open={showVisitDetails} onOpenChange={setShowVisitDetails}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[9999]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-[500px] z-[10000] shadow-2xl">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Detalhes da Visita
            </Dialog.Title>

            {selectedVisit && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{selectedVisit.clientName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      newStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      newStatus === 'in_negotiation' ? 'bg-yellow-100 text-yellow-800' :
                      newStatus === 'completed_purchase' ? 'bg-green-100 text-green-800' :
                      newStatus === 'completed_no_purchase' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {newStatus === 'scheduled' ? 'Agendada' :
                       newStatus === 'in_negotiation' ? 'Em Negociação' :
                       newStatus === 'completed_purchase' ? 'Venda Realizada' :
                       newStatus === 'completed_no_purchase' ? 'Sem Venda' :
                       newStatus === 'rescheduled' ? 'Reagendada' :
                       newStatus === 'absent' ? 'Cliente Ausente' :
                       newStatus === 'thinking' ? 'Cliente vai Pensar' :
                       newStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-start text-gray-700">
                      <CalendarIcon className="w-5 h-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Data e Hora</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(selectedVisit.scheduledDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-start text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 mt-0.5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Local</p>
                        <p className="text-sm text-gray-600">{selectedVisit.location}</p>
                      </div>
                    </div>
                  </div>

                  {editingStatus ? (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Atualizar Status da Visita
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as VisitStatus)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="scheduled">Agendada</option>
                          <option value="in_negotiation">Em Negociação</option>
                          <option value="completed_purchase">Venda Realizada</option>
                          <option value="completed_no_purchase">Sem Venda</option>
                          <option value="rescheduled">Reagendada</option>
                          <option value="absent">Cliente Ausente</option>
                          <option value="thinking">Cliente vai Pensar</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Observações
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Adicione observações sobre a visita..."
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleUpdateStatus}
                          className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Check size={18} />
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditingStatus(false);
                            setNewStatus(selectedVisit.status);
                            setNotes(selectedVisit.notes || '');
                          }}
                          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {notes && (
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <p className="font-medium text-amber-900 mb-2">Observações</p>
                          <p className="text-sm text-amber-800">{notes}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  {!editingStatus && (
                    <button
                      onClick={() => setEditingStatus(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md"
                    >
                      Atualizar Status
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowVisitDetails(false);
                      setEditingStatus(false);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}