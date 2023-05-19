import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WeatherData } from '../interfaces/weatherData.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiURL: string = environment.config.apiURL;
  apiKey: string = environment.config.apiKey

  constructor(private http: HttpClient) { }

  getWeatherData(city: string): Observable<WeatherData> {
    return this.http.get<WeatherData>(this.apiURL + '=' + city + '&appid=' + this.apiKey)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    })
  }
}
