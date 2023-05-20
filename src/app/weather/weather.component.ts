import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Subject, takeUntil, tap, throwError } from 'rxjs';
import { WeatherData } from '../shared/interfaces/weatherData.interface';
import { LoggerService } from '../shared/services/logger.service';
import { WeatherService } from '../shared/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {

  searchForm!: FormGroup; 
  city!: string;
  weatherData!: WeatherData;
  cityArray: any = [];
  errorOccured = false;
  
  unsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private weatherService: WeatherService, private fb: FormBuilder, private loggerService: LoggerService) {

  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      city: ['', Validators.required]
    });
  }

  get f() { return this.searchForm.controls; }

  getWeatherData(city: string, action?: string) {
    this.weatherService.getWeatherData(city).pipe(
      tap((data) => this.loggerService.info('fetching data', data)),
      takeUntil(this.unsubscribe),
      catchError((error) => {
        return throwError(() => {
          this.loggerService.error('error occured', error);
          this.errorOccured = true;
        })
      })
    ).subscribe((response: WeatherData) => {
      this.weatherData = response;
      this.errorOccured = false;
      if(!action) {
        this.addToList(this.city, this.weatherData);
      }
    })
  }

  search() {
    if(this.searchForm.valid) {
      this.city = this.searchForm.get('city')?.value;
      this.getWeatherData(this.city);
      this.searchForm.reset();
    } else {
      return;
    }
  }

  addToList(city: string, weatherDetails: WeatherData) {
    this.cityArray.push({key: city, weatherDetails});
  }

  removeCity(city: string, action: string) {
    const index = (this.cityArray).findIndex((el: any) => {
      return el.key === city;
    });
    (this.cityArray).splice(index, 1);
    if (index !== 0) {
      this.getWeatherData(this.cityArray[index - 1].key, action);
      this.errorOccured = false;
    } else {
      this.errorOccured = true;
    }
  }

  getSelectedCityWeather(selectedCityObj: any) {
    this.weatherData = selectedCityObj.weatherDetails;
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }


}
