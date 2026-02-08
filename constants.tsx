
import React from 'react';
import { CertificateType, CertificateSource, SignatureSeal } from './types';

export const COLORS = {
  primary: '#2563EB',
  secondary: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const INITIAL_SEALS: SignatureSeal[] = [
  {
    id: 'native-1',
    name: 'Selo Padrão ICP-Brasil',
    isNative: true,
    isDefault: true,
    // Fix: Adding missing properties required by SignatureSeal interface
    useCustomImageOnly: false,
    watermarkOpacity: 0.0,
    template: {
      width: 250,
      height: 100,
      backgroundColor: '#ffffff',
      borderColor: '#2563EB',
      borderWidth: 2,
      borderRadius: 4,
    },
    fields: [
      {
        id: 'f1',
        type: 'CERTIFICATE_INFO',
        label: 'Assinado por:',
        certificateField: 'CN',
        position: { x: 10, y: 10 },
        fontSize: 14,
        fontColor: '#000000',
        fontWeight: 'bold',
      },
      {
        id: 'f2',
        type: 'DATE',
        label: 'Data:',
        position: { x: 10, y: 40 },
        fontSize: 12,
        fontColor: '#475569',
        fontWeight: 'normal',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const MOCK_CERTIFICATES = [
  {
    id: 'cert-1',
    type: CertificateType.A1,
    source: CertificateSource.FILE,
    subjectName: 'JOAO DA SILVA:12345678900',
    issuerName: 'AC SOLUTI Multipla v5',
    serialNumber: '5E8A9F12B3C4D5E6',
    validFrom: '2023-01-01',
    validTo: '2024-01-01',
    thumbprint: 'SHA256:...',
    isTest: false,
    createdAt: new Date().toISOString(),
  }
];
