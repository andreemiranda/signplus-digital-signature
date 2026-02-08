
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Placeholder: Necessário registrar no Google Cloud Console
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export const googleDriveService = {
  getAccessToken(): string | null {
    const token = localStorage.getItem('google_drive_token');
    const expiry = localStorage.getItem('google_drive_token_expiry');
    
    if (!token || !expiry) return null;
    if (Date.now() > parseInt(expiry)) {
      this.disconnect();
      return null;
    }
    return token;
  },

  connect() {
    const redirectUri = window.location.origin + window.location.pathname;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(SCOPES)}&include_granted_scopes=true&state=google_drive_auth`;
    window.location.href = authUrl;
  },

  disconnect() {
    localStorage.removeItem('google_drive_token');
    localStorage.removeItem('google_drive_token_expiry');
    localStorage.removeItem('google_drive_user');
  },

  async uploadFile(file: File | Blob, fileName: string, mimeType: string) {
    const token = this.getAccessToken();
    if (!token) throw new Error("Google Drive não conectado");

    const metadata = {
      name: fileName,
      mimeType: mimeType,
      description: 'Documento assinado via SignPlus'
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    try {
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro ao subir para Google Drive');
      }

      return await response.json();
    } catch (error) {
      console.error('Google Drive Upload Error:', error);
      throw error;
    }
  },

  async getUserInfo() {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await response.json();
    } catch (e) {
      return null;
    }
  }
};
