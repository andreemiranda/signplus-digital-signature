
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
    const jwtToken = localStorage.getItem('signplus_jwt');
    
    // Prioriza o JWT se disponível para integração SSO, senão usa X-Api-Key
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };

    if (jwtToken) {
      headers['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      headers['X-Api-Key'] = apiKey;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      if (data instanceof FormData) {
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
        const text = await response.text();
        throw new Error(`Erro Crítico na API (HTTP ${response.status})`);
      }

      const internalStatus = result.status || response.status;

      if (!response.ok || (internalStatus >= 400)) {
        throw new Error(result.message || result.error || `Falha na requisição (${internalStatus})`);
      }

      return result;
    } catch (error: any) {
      console.error('Assinafy SDK Log:', error.message);
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
      signerIds: signerIds, 
      message: message || "Assinatura solicitada via SignPlus Cloud."
    });
  },

  async listDocuments(accountId: string, status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.apiCall('GET', `/accounts/${accountId}/documents${query}`);
  }
};
