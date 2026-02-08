
export enum CertificateType {
  A1 = 'A1',
  A3 = 'A3',
  TEST = 'TEST'
}

export enum CertificateSource {
  FILE = 'FILE',
  TOKEN = 'TOKEN',
  SMARTCARD = 'SMARTCARD'
}

export interface Certificate {
  id: string;
  type: CertificateType;
  source: CertificateSource;
  subjectName: string;
  issuerName: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  thumbprint: string;
  isTest: boolean;
  createdAt: string;
}

export interface SignatureField {
  id: string;
  type: 'TEXT' | 'DATE' | 'TIME' | 'CERTIFICATE_INFO';
  label: string;
  certificateField?: 'CN' | 'CPF' | 'CNPJ' | 'EMAIL';
  position: { x: number; y: number };
  fontSize: number;
  fontColor: string;
  fontWeight: 'normal' | 'bold';
}

export interface SignatureSeal {
  id: string;
  name: string;
  isNative: boolean;
  isDefault: boolean;
  useCustomImageOnly: boolean; // Se true, ignora campos e cores, usa apenas a imagem enviada
  customSealImage?: string; // Base64 da imagem do selo completo
  watermarkImage?: string; // Base64 da marca d'água
  watermarkOpacity: number;
  template: {
    width: number;
    height: number;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  };
  fields: SignatureField[];
  createdAt: string;
  updatedAt: string;
}

export interface SignedDocument {
  id: string;
  originalFileName: string;
  signedFileName: string;
  fileType: 'PDF' | 'XML';
  fileSize: number;
  signedAt: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED' | 'INVALID';
  signerName: string;
  isBackedUp?: boolean;
  driveFileId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entityType: string;
  result: 'SUCCESS' | 'FAILURE';
  details: string;
}
