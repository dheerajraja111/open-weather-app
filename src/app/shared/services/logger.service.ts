import { Injectable } from '@angular/core';
import { LogLevel } from '../models/logLevel.model';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  logLevel: LogLevel = new LogLevel();

  info(msg: string, data?: any) {
    this.logWith(this.logLevel.Info, msg, data);
  }

  warn(msg: string, data?: any) {
    this.logWith(this.logLevel.Warn, msg, data);
  }

  error(msg: string, data?: any) {
    this.logWith(this.logLevel.Error, msg, data);
  }

  private logWith(level: any, msg: string, data?: any) {
    if (level <= this.logLevel.Error) {
      switch(level) {
        case this.logLevel.None:
          return console.log(msg);
        case this.logLevel.Info:
          return console.log('%c' + msg, 'color: #6495ED', data);
        case this.logLevel.Warn:
          return console.warn('%c' + msg, 'color: #FF8C00', data);
        case this.logLevel.Error:
          return console.error('%c' + msg, 'color: #DC143C', data);
        default:
          console.debug(msg);
      }
    }
  }


}
