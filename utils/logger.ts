
type LogLevel = 'INFO' | 'WARN' | 'ERROR';

class Logger {
  log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level}] ${message}`;
    
    // Fix: Use process.env.NODE_ENV check instead of import.meta.env.DEV
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
      console.log(entry, data || '');
    }

    if (level === 'ERROR' && !isDev) {
      // Aqui integraria com Sentry ou LogRocket
    }
  }

  info(msg: string, data?: any) { this.log('INFO', msg, data); }
  warn(msg: string, data?: any) { this.log('WARN', msg, data); }
  error(msg: string, data?: any) { this.log('ERROR', msg, data); }
}

export const logger = new Logger();
