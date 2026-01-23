# Configuração do Rastreamento de Vendedores com Mapbox

Este documento explica como implementar o rastreamento de localização de vendedores usando a API do Mapbox.

## API Key Fornecida
```
pk.eyJ1IjoiaGlkcm9taW5lcmFsIiwiYSI6ImNta3I4amphcTEwbmwzZm9mOWU2cXkzaW0ifQ.jECdFsx1bx8zywjz6akiog
```

## Instalação das Dependências

```bash
npm install mapbox-gl @types/mapbox-gl
```

## 1. Adicionar Variável de Ambiente

Adicione ao arquivo `.env`:
```
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiaGlkcm9taW5lcmFsIiwiYSI6ImNta3I4amphcTEwbmwzZm9mOWU2cXkzaW0ifQ.jECdFsx1bx8zywjz6akiog
```

## 2. Criar Tabela de Localização no Supabase

Execute esta migration:

```sql
-- Criar tabela de localizações dos vendedores
CREATE TABLE IF NOT EXISTS vendor_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  accuracy decimal,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE vendor_locations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Public access to vendor_locations"
  ON vendor_locations FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Índice para melhor performance
CREATE INDEX idx_vendor_locations_vendor_id ON vendor_locations(vendor_id);
CREATE INDEX idx_vendor_locations_timestamp ON vendor_locations(timestamp DESC);
```

## 3. Criar Hook de Geolocalização

Crie `src/hooks/useGeolocation.ts`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function useGeolocation(vendorId: string, enabled: boolean = true) {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !vendorId) return;

    let watchId: number;

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const newPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          };

          setPosition(newPosition);

          // Salvar no Supabase
          await supabase
            .from('vendor_locations')
            .insert([{
              vendor_id: vendorId,
              latitude: newPosition.latitude,
              longitude: newPosition.longitude,
              accuracy: newPosition.accuracy
            }]);
        },
        (err) => {
          setError(err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocalização não suportada');
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [vendorId, enabled]);

  return { position, error };
}
```

## 4. Adicionar Rastreamento no Dashboard do Vendedor

Em `src/pages/VendorDashboard.tsx`, adicione:

```typescript
import { useGeolocation } from '../hooks/useGeolocation';
import { useAuth } from '../contexts/AuthContext';

function VendorDashboard() {
  const { user } = useAuth();
  const { position, error } = useGeolocation(user?.id || '', true);

  // O hook já cuida de enviar a localização automaticamente
  // ...resto do código
}
```

## 5. Criar Componente do Mapa para Admin

Crie `src/components/VendorMap.tsx`:

```typescript
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '../lib/supabase';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

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
  const [locations, setLocations] = useState<VendorLocation[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-46.6333, -23.5505], // São Paulo
      zoom: 10
    });

    loadVendorLocations();

    // Atualizar a cada 30 segundos
    const interval = setInterval(loadVendorLocations, 30000);

    return () => {
      clearInterval(interval);
      map.current?.remove();
    };
  }, []);

  const loadVendorLocations = async () => {
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

    if (data && !error) {
      // Pegar apenas a localização mais recente de cada vendedor
      const latestLocations = data.reduce((acc, loc) => {
        if (!acc[loc.vendor_id] || new Date(loc.timestamp) > new Date(acc[loc.vendor_id].timestamp)) {
          acc[loc.vendor_id] = {
            ...loc,
            vendor_name: loc.profiles?.full_name || 'Vendedor'
          };
        }
        return acc;
      }, {} as Record<string, any>);

      const locationsArray = Object.values(latestLocations) as VendorLocation[];
      setLocations(locationsArray);
      updateMarkers(locationsArray);
    }
  };

  const updateMarkers = (locations: VendorLocation[]) => {
    if (!map.current) return;

    locations.forEach(location => {
      const el = document.createElement('div');
      el.className = 'vendor-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
      el.style.backgroundSize = '100%';

      new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px 0; font-weight: bold;">${location.vendor_name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  Última atualização: ${new Date(location.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
            `)
        )
        .addTo(map.current!);
    });
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
```

## 6. Adicionar Mapa na Página de Vendedores

Em `src/pages/admin/Vendors.tsx`, adicione:

```typescript
import { VendorMap } from '../../components/VendorMap';

// Dentro do componente, adicione uma seção:
<div className="bg-white rounded-lg shadow-md p-6 mb-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">
    Localização dos Vendedores
  </h2>
  <VendorMap />
</div>
```

## 7. Solicitar Permissão de Localização

Quando o vendedor fizer login pela primeira vez, mostre uma mensagem pedindo permissão para acessar a localização.

## Observações Importantes

1. **Privacidade**: Certifique-se de informar aos vendedores que a localização está sendo rastreada
2. **Bateria**: O rastreamento contínuo consome bateria. Considere ajustar a frequência de atualização
3. **Precisão**: A precisão varia dependendo do dispositivo e condições (GPS, Wi-Fi, etc.)
4. **Permissões**: O usuário precisa conceder permissão para acessar a localização no navegador

## Testando

1. Faça login como vendedor
2. Permita o acesso à localização quando solicitado
3. No painel admin, acesse a página de vendedores
4. Você verá o mapa com a localização em tempo real dos vendedores
