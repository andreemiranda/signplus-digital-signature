
const ASSINAFY_CONFIG = {
  defaultApiKey: 'WdVdS-JOtwm1iSr9c5gXsj-eflYe56lU3JCMdR0uXZTD9x5HRaux4nS7eMREjPI',
  baseURL: 'https://api.assinafy.com.br/v1'
};

export const assinafyService = {
  getApiKey(): string {
    return localStorage.getItem('assinafy_api_key') || ASSINAFY_CONFIG.defaultApiKey;
  },

  async apiCall(method: string, endpoint: string, data?: any) {
    const apiKey = this.getApiKey();
    
    // Conforme pág 1 e 5 da doc, X-Api-Key é o padrão oficial para integrações backend
    const headers: Record<string, string> = {
      'X-Api-Key': apiKey,
      'Accept': 'application/json'
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      if (data instanceof FormData) {
        // O browser define o Content-Type com boundary automaticamente para FormData
        options.body = data;
      } else {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(`${ASSINAFY_CONFIG.baseURL}${endpoint}`, options);
      
      const contentType = response.headers.get("content-type");
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // Se não for JSON, pode ser um erro de servidor (500) ou firewall
        const text = await response.text();
        throw new Error(`Erro Crítico na API (HTTP ${response.status}): Resposta não-JSON recebida.`);
      }

      // Verificação de status interno do payload (Páginas 1 e 2)
      const internalStatus = result.status || response.status;

      if (!response.ok || (internalStatus >= 400)) {
        if (internalStatus === 401 || internalStatus === 403) {
          throw new Error('Falha de Autenticação Assinafy: Verifique se sua API Key é válida para este ambiente.');
        }
        throw new Error(result.message || result.error || `Falha na requisição (Status ${internalStatus})`);
      }

      return result;
    } catch (error: any) {
      console.error('Assinafy SDK Log:', error.message);
      throw error;
    }
  },

  async uploadDocument(accountId: string, file: File) {
    // Endpoint: POST /accounts/:account_id/documents (Página 3)
    const formData = new FormData();
    formData.append('file', file);
    return this.apiCall('POST', `/accounts/${accountId}/documents`, formData);
  },

  async createSigner(accountId: string, signerData: { fullName: string, email: string, whatsapp?: string }) {
    // Endpoint: POST /accounts/:account_id/signers (Páginas 4 e 7)
    return this.apiCall('POST', `/accounts/${accountId}/signers`, {
      full_name: signerData.fullName,
      email: signerData.email,
      whatsapp_phone_number: signerData.whatsapp || undefined
    });
  },

  async createAssignment(documentId: string, signerIds: string[], message?: string) {
    // Endpoint: POST /documents/:document_id/assignments (Página 4 e 21)
    return this.apiCall('POST', `/documents/${documentId}/assignments`, {
      method: 'virtual',
      signerIds: signerIds, 
      message: message || "Assinatura solicitada via SignPlus Cloud."
    });
  },

  async listDocuments(accountId: string, status?: string) {
    // Endpoint: GET /accounts/:account_id/documents (Página 13)
    const query = status ? `?status=${status}` : '';
    return this.apiCall('GET', `/accounts/${accountId}/documents${query}`);
  }
};
