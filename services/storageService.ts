
import { Certificate, SignedDocument, SignatureSeal, AuditLog } from '../types';
import { INITIAL_SEALS } from '../constants';

const STORAGE_KEYS = {
  CERTIFICATES: 'signplus_certs',
  DOCUMENTS: 'signplus_docs',
  SEALS: 'signplus_seals',
  AUDIT: 'signplus_audit',
};

const getItems = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const setItems = <T>(key: string, items: T[]) => {
  localStorage.setItem(key, JSON.stringify(items));
};

const addAuditLog = (action: string, entityType: string, entityId: string, result: 'SUCCESS' | 'FAILURE') => {
  const log: AuditLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    entityType,
    result,
    details: `Ação ${action} em ${entityType} (${entityId})`,
  };
  const logs = getItems<AuditLog>(STORAGE_KEYS.AUDIT);
  setItems(STORAGE_KEYS.AUDIT, [log, ...logs].slice(0, 500));
};

export const storageService = {
  getCertificates(): Certificate[] { return getItems<Certificate>(STORAGE_KEYS.CERTIFICATES); },
  addCertificate(cert: Certificate) {
    const items = this.getCertificates();
    setItems(STORAGE_KEYS.CERTIFICATES, [...items, cert]);
    addAuditLog('CARGA_CERTIFICADO', 'CERTIFICADO', cert.id, 'SUCCESS');
  },
  removeCertificate(id: string) {
    const items = this.getCertificates().filter(c => c.id !== id);
    setItems(STORAGE_KEYS.CERTIFICATES, items);
    addAuditLog('REMOÇÃO_CERTIFICADO', 'CERTIFICADO', id, 'SUCCESS');
  },

  getDocuments(): SignedDocument[] { return getItems<SignedDocument>(STORAGE_KEYS.DOCUMENTS); },
  addDocument(doc: SignedDocument) {
    const items = this.getDocuments();
    setItems(STORAGE_KEYS.DOCUMENTS, [doc, ...items]);
    addAuditLog('ASSINATURA_DOCUMENTO', 'DOCUMENTO', doc.id, 'SUCCESS');
  },
  updateDocument(id: string, updates: Partial<SignedDocument>) {
    const items = this.getDocuments();
    const updated = items.map(d => d.id === id ? { ...d, ...updates } : d);
    setItems(STORAGE_KEYS.DOCUMENTS, updated);
  },
  removeDocument(id: string) {
    const items = this.getDocuments().filter(d => d.id !== id);
    setItems(STORAGE_KEYS.DOCUMENTS, items);
    addAuditLog('REMOÇÃO_DOCUMENTO', 'DOCUMENTO', id, 'SUCCESS');
  },

  getSeals(): SignatureSeal[] {
    const customSeals = getItems<SignatureSeal>(STORAGE_KEYS.SEALS);
    return [...INITIAL_SEALS, ...customSeals];
  },
  addSeal(seal: SignatureSeal) {
    const items = getItems<SignatureSeal>(STORAGE_KEYS.SEALS);
    setItems(STORAGE_KEYS.SEALS, [...items, seal]);
    addAuditLog('CRIAÇÃO_SELO', 'SELO', seal.id, 'SUCCESS');
  },

  getAuditLogs(): AuditLog[] { return getItems<AuditLog>(STORAGE_KEYS.AUDIT); },
  clearAuditLogs() { setItems(STORAGE_KEYS.AUDIT, []); }
};
