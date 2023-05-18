import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import { WeatherData } from '../shared/interfaces/weatherData.interface';
import { WeatherService } from '../shared/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  iconUrl: string = 'https://openweathermap.org/img/wn/10d@2x.png';
  searchForm!: FormGroup;
  city!: string;
  weatherData!: WeatherData;
  cityArray: Array<string> = [];
  errorMessage!: string;
  submitted = false;

  constructor(private weatherService: WeatherService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      city: ['', Validators.required]
    })
  }

  get f() { return this.searchForm.controls; }

  getWeatherData(city: string) {
    this.weatherService.getWeatherData(city).pipe(
      tap((data) => console.log('tap data',data)),
      catchError((error) => {
        return throwError(() => {
          console.log('Error found', error);
          this.errorMessage = 'Invalid data';
        })
      })
    ).subscribe((response: WeatherData) => {
      this.weatherData = response;
      console.log('weatherData: ', response)
    })
  }

  search() {
    if(this.searchForm.valid) {
      this.city = this.searchForm.get('city')?.value;
      this.getWeatherData(this.city);
      this.addToList(this.city);
    } else {
      return;
    }
  }

  addToList(city: string) {
    this.cityArray.push(city);
  }

  removeCity(city: string) {
    const index = (this.cityArray).indexOf(city);
    (this.cityArray).splice(index, 1);
    const length = this.cityArray.length;
    this.getWeatherData(this.cityArray[length - 1]);
  }


}
