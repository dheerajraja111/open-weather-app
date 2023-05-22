import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { WeatherData } from '../shared/interfaces/weatherData.interface';
import { LoggerService } from '../shared/services/logger.service';
import { WeatherService } from '../shared/services/weather.service';

import { WeatherComponent } from './weather.component';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherService: WeatherService;
  let loggerService: LoggerService;
  let mockData: WeatherData;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [WeatherComponent],
      providers: [WeatherService, LoggerService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService);
    loggerService = TestBed.inject(LoggerService);

    mockData = {
      base: 'stations',
      clouds: {
        all: 40
      },
      coord :  {
        lon: -0.1257,
        lat: 51.5085
      },
      dt: 1684495337,
      cod: 200,
      timezone: 19800,
      name: 'London',
      id: 1278946,
      weather: [{
        id: 800,
        main: 'clear',
        description: 'clear sky',
        icon: '01d'
      }],
      main: {
        feels_like: 37.96,
        humidity: 11,
        pressure: 1003,
        temp: 40.77,
        temp_max: 40.77,
        temp_min: 40.77
      },
      visibility: 10000,
      wind: {
        deg: 309,
        gust: 8.34,
        speed: 6.88
      },
      sys: {
        country: 'GB',
        id: 1414,
        sunrise: 1684469018,
        sunset: 1684525832,
        type: 1
      }
    };

    fixture.detectChanges();

  });

  afterEach(() => {
    fixture.destroy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the search form', () => {
    expect(component.searchForm).toBeDefined();
    expect(component.f['city'].value).toEqual('');
  });

  it('should call getWeatherData and addToList on search button click', () => {
    const mockCity = 'London';

    spyOn(weatherService, 'getWeatherData').and.returnValue(of(mockData));
    spyOn(component, 'addToList');

    component.searchForm.get('city')?.setValue(mockCity);
    component.search();

    expect(weatherService.getWeatherData).toHaveBeenCalledWith(mockCity);
    expect(component.addToList).toHaveBeenCalledWith(mockCity, mockData);
    expect(component.weatherData).toEqual(mockData);
    expect(component.errorOccured).toBeFalse();
  });

  it('should remove a city from the list and call getWeatherData with the previous city', () => {
    const mockCity = 'London'; 

    component.cityArray = [
      { key: 'City1', weatherDetails: {}},
      { key: mockCity, weatherDetails: mockData},
      { key: 'City3', weatherDetails: {}},
    ];

    spyOn(component, 'getWeatherData');

    component.removeCity(mockCity, 'action');

    expect(component.cityArray.length).toBe(2);
    expect(component.getWeatherData).toHaveBeenCalledWith('City1', 'action');
    expect(component.errorOccured).toBeFalse();
  });

  it('should unsubscribe from observables on component destruction', () => {
    spyOn(component.unsubscribe, 'next');
    spyOn(component.unsubscribe, 'complete');

    component.ngOnDestroy();

    expect(component.unsubscribe.next).toHaveBeenCalledWith(true);
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });

  it('should set errorOccured flag when trying to remove the last city from the list', () => {
    const city = 'London';

    component.cityArray = [{ key: city, weatherDetails: { /* Mock weather data here */ } }];

    component.removeCity(city, 'action');

    expect(component.cityArray.length).toBe(0);
    expect(component.errorOccured).toBeTrue();
  });

});
