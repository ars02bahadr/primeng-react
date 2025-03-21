import { Toast } from 'primereact/toast';

interface ApiError {
  response?: {
    status: number;
    data?: {
      ErrorMessages?: string[];
    };
  };
}

interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
  life?: number;
}

class ErrorService {
  private static instance: ErrorService;
  private toast: Toast | null = null;

  private constructor() {}

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  setToastInstance(toast: Toast): void {
    this.toast = toast;
  }

  private showToast(message: ToastMessage): void {
    if (!this.toast) {
      console.error('Toast instance not set');
      return;
    }
    this.toast.show(message);
  }

  errorHandler(error: ApiError): void {
    if (!this.toast) {
      console.error('Toast instance not set');
      return;
    }


    if (!error.response) {
      this.showToast({
        severity: 'error',
        summary: 'Hata',
        detail: 'API adresine ulaşılamıyor',
        life: 3000
      });
      return;
    }

    switch (error.response.status) {
      case 400:
        this.showToast({
          severity: 'error',
          summary: 'Hata',
          detail: error.response.data?.ErrorMessages?.join('\n') || 'Geçersiz istek',
          life: 3000
        });
        break;

      case 401:
        this.showToast({
          severity: 'error',
          summary: 'Hata',
          detail: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
          life: 3000
        });
        break;

      case 403:
        this.showToast({
          severity: 'error',
          summary: 'Hata',
          detail: error.response.data?.ErrorMessages?.join('\n') || 'Yetkisiz erişim',
          life: 3000
        });
        break;

      case 404:
        this.showToast({
          severity: 'error',
          summary: 'Hata',
          detail: 'İstenilen kaynak bulunamadı',
          life: 3000
        });
        break;

      case 500:
        this.showToast({
          severity: 'error',
          summary: 'Hata',
          detail: 'Sunucu hatası',
          life: 3000
        });
        break;

      default:
        this.showToast({
          severity: 'error',
          summary: 'Hata',
          detail: 'Beklenmeyen bir hata oluştu',
          life: 3000
        });
        break;
    }
  }
}

// Create a singleton instance
const errorService = ErrorService.getInstance();
export default errorService;
