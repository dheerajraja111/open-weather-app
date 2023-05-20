import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';


import { WeatherService } from './weather.service';
import { WeatherData } from '../interfaces/weatherData.interface';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retreive weather data for a city', () => {
    const mockCity = 'London';
    const mockWeatherData: WeatherData = {
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

    }

    service.getWeatherData(mockCity).subscribe((data: WeatherData) => {
      expect(data).toEqual(mockWeatherData);
    });
    const req = httpMock.expectOne(service.apiURL + '=' + mockCity + '&appid=' + service.apiKey);
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData);
  });

  it('should handle HTTP errors', (done: DoneFn) => {
    const cityName = 'InvalidCity';
    const errorMessage = 'Not found';

    service.getWeatherData(cityName).subscribe(
      () => {},
      error => {
        expect(error).toEqual(`Error Code: 404\nMessage: ${errorMessage}`);
        done();
      }
    );

    const req = httpMock.expectOne(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${service.apiKey}&units=metric`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
  


});
