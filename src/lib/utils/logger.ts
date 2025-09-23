interface LogContext {
  [key: string]: any;
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDev = __DEV__ || process.env.NODE_ENV === 'development';
  private prefix = '[CrossLingo]';

  private formatMessage(level: LogLevel, module: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toLocaleTimeString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `${this.prefix} ${timestamp} [${level.toUpperCase()}] ${module}: ${message}${contextStr}`;
  }

  debug(module: string, message: string, context?: LogContext) {
    if (this.isDev) {
      console.log(this.formatMessage('debug', module, message, context));
    }
  }

  info(module: string, message: string, context?: LogContext) {
    console.info(this.formatMessage('info', module, message, context));
  }

  warn(module: string, message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', module, message, context));
  }

  error(module: string, message: string, error?: Error, context?: LogContext) {
    const errorContext = error ? { 
      ...context, 
      error: error.message, 
      stack: error.stack 
    } : context;
    console.error(this.formatMessage('error', module, message, errorContext));
  }

  // Specialized logging methods for common use cases
  apiCall(module: string, method: string, url?: string, context?: LogContext) {
    this.info(module, `API call: ${method}`, { url, ...context });
  }

  apiSuccess(module: string, method: string, duration?: number, context?: LogContext) {
    this.info(module, `API success: ${method}`, { duration: `${duration}ms`, ...context });
  }

  apiError(module: string, method: string, error: Error, context?: LogContext) {
    this.error(module, `API error: ${method}`, error, context);
  }

  stateChange(module: string, action: string, context?: LogContext) {
    this.debug(module, `State change: ${action}`, context);
  }

  userAction(module: string, action: string, context?: LogContext) {
    this.info(module, `User action: ${action}`, context);
  }
}

export const logger = new Logger();
