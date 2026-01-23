import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '../lib/supabase';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlkcm9taW5lcmFsIiwiYSI6ImNta3I4amphcTEwbmwzZm9mOWU2cXkzaW0ifQ.jECdFsx1bx8zywjz6akiog';

interface VendorLocation {
  vendor_id: string;
  latitude: number;
  longitude: number;
  vendor_name: string;
  timestamp: string;
}

export function VendorMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [locations, setLocations] = useState<VendorLocation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-55.5106, -12.6819], // Centro do Brasil (Mato Grosso)
        zoom: 5
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      loadVendorLocations();

      // Atualizar a cada 30 segundos
      const interval = setInterval(loadVendorLocations, 30000);

      return () => {
        clearInterval(interval);
        map.current?.remove();
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Erro ao carregar o mapa');
    }
  }, []);

  const loadVendorLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_locations')
        .select(`
          vendor_id,
          latitude,
          longitude,
          timestamp,
          profiles!inner(full_name)
        `)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error loading locations:', error);
        setError('Erro ao carregar localizações');
        return;
      }

      if (data) {
        // Pegar apenas a localização mais recente de cada vendedor
        const latestLocations = data.reduce((acc, loc: any) => {
          if (!acc[loc.vendor_id] || new Date(loc.timestamp) > new Date(acc[loc.vendor_id].timestamp)) {
            acc[loc.vendor_id] = {
              vendor_id: loc.vendor_id,
              latitude: parseFloat(loc.latitude),
              longitude: parseFloat(loc.longitude),
              timestamp: loc.timestamp,
              vendor_name: loc.profiles?.full_name || 'Vendedor'
            };
          }
          return acc;
        }, {} as Record<string, VendorLocation>);

        const locationsArray = Object.values(latestLocations);
        setLocations(locationsArray);
        updateMarkers(locationsArray);
      }
    } catch (err) {
      console.error('Error in loadVendorLocations:', err);
      setError('Erro ao carregar localizações dos vendedores');
    }
  };

  const updateMarkers = (locations: VendorLocation[]) => {
    if (!map.current) return;

    // Remover marcadores antigos
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    locations.forEach(location => {
      const el = document.createElement('div');
      el.className = 'vendor-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDA3OGQ0Ij48cGF0aCBkPSJNMTIgMEM3LjYgMCA0IDMuNiA0IDhjMCA1LjQgOCAxNiA4IDE2czgtMTAuNiA4LTE2YzAtNC40LTMuNi04LTgtOHptMCAxMmMtMi4yIDAtNC0xLjgtNC00czEuOC00IDQtNCA0IDEuOCA0IDQtMS44IDQtNCA0eiIvPjwvc3ZnPg==)';
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 12px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #1a202c;">
                  ${location.vendor_name}
                </h3>
                <p style="margin: 0; font-size: 13px; color: #718096;">
                  <strong>Última atualização:</strong><br/>
                  ${new Date(location.timestamp).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #a0aec0;">
                  Lat: ${location.latitude.toFixed(6)}<br/>
                  Lng: ${location.longitude.toFixed(6)}
                </p>
              </div>
            `)
        )
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Ajustar o zoom para mostrar todos os marcadores
    if (locations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach(loc => {
        bounds.extend([loc.longitude, loc.latitude]);
      });
      map.current?.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  };

  if (error) {
    return (
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <p className="text-gray-600 text-sm">
            Certifique-se de que a tabela vendor_locations existe no banco de dados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Rastreamento em Tempo Real
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                {locations.length === 0
                  ? 'Nenhum vendedor com localização ativa no momento'
                  : `Mostrando ${locations.length} vendedor${locations.length > 1 ? 'es' : ''} ativo${locations.length > 1 ? 's' : ''}`
                }
              </p>
              <p className="mt-1 text-xs">
                As localizações são atualizadas automaticamente a cada 30 segundos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
}
