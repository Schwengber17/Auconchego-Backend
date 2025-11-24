enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.formatTimestamp()
    const dataStr = data ? ` | ${JSON.stringify(data)}` : ""
    return `[${timestamp}] [${level}] ${message}${dataStr}`
  }

  info(message: string, data?: any): void {
    console.log(this.formatMessage(LogLevel.INFO, message, data))
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, data))
  }

  error(message: string, data?: any): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, data))
  }

  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, data))
    }
  }

  logRequest(method: string, path: string, statusCode?: number): void {
    const status = statusCode ? ` | Status: ${statusCode}` : ""
    this.info(`${method} ${path}${status}`)
  }

  logError(error: any, context?: string): void {
    const ctx = context ? ` | Context: ${context}` : ""
    this.error(`${error.message}${ctx}`, { stack: error.stack })
  }
}

export const logger = new Logger()
