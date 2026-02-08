
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
    
    const headers: Record<string, string> = {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (data && !(data instanceof FormData)) {
      options.body = JSON.stringify(data);
    } else if (data instanceof FormData) {
      delete headers['Content-Type']; // Browser define o boundary automaticamente
      options.body = data;
    }

    try {
      const response = await fetch(`${ASSINAFY_CONFIG.baseURL}${endpoint}`, options);
      
      // Verifica se a resposta é JSON antes de tentar o parse
      const contentType = response.headers.get("content-type");
      let result;
      
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Resposta inesperada do servidor (HTTP ${response.status}). Verifique suas credenciais.`);
      }

      if (!response.ok) {
        // Tratamento específico para erros de autenticação
        if (response.status === 401 || response.status === 403) {
          throw new Error('Credenciais inválidas. Verifique sua API Key e Account ID nas configurações.');
        }
        throw new Error(result.message || result.error || 'Erro na operação da API');
      }

      return result;
    } catch (error: any) {
      console.error('Assinafy API Error:', error.message);
      throw error;
    }
  },

  async uploadDocument(accountId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiCall('POST', `/accounts/${accountId}/documents`, formData);
  },

  async createSigner(accountId: string, signerData: { fullName: string, email: string, whatsapp?: string }) {
    return this.apiCall('POST', `/accounts/${accountId}/signers`, {
      full_name: signerData.fullName,
      email: signerData.email,
      whatsapp_phone_number: signerData.whatsapp || undefined
    });
  },

  async createAssignment(documentId: string, signerIds: string[], message?: string) {
    return this.apiCall('POST', `/documents/${documentId}/assignments`, {
      method: 'virtual',
      signers: signerIds.map(id => ({ id })),
      message: message || null
    });
  },

  async listDocuments(accountId: string, status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.apiCall('GET', `/accounts/${accountId}/documents${query}`);
  }
};
