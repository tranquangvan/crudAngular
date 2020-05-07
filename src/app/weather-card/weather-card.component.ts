import { Component, OnInit,EventEmitter,Input,OnDestroy,Output } from '@angular/core';
import {Router} from '@angular/router';
import {WeatherService} from '../weather.service';
import {UiService} from '../ui.service';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {FbService} from '../service/fb/fb.service';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css']
})
export class WeatherCardComponent implements OnInit,OnDestroy {
  @Input() set city(city:string){

    this.weather.getWeather(city,'metric').pipe(first()).subscribe((payload) =>{
      this.state = payload.weather[0].main;
      this.temp = Math.ceil(payload.main.temp);
      console.log("city Input = "+city);
    });
    this.weather.getNameCity(city,'metric').pipe(first()).subscribe((payload) =>{
    console.log(payload.name);
    this.cityName = payload.name;
    });
    this.weather.getForecast(city,'metric').pipe(first()).subscribe((payload) => {
      this.maxTemp = Math.round(payload[0].main.temp);
      this.minTemp = Math.round(payload[0].main.temp);
      console.log(payload);
      for(const res of payload){
          this.maxTemp = res.main.temp > this.maxTemp ? Math.round(res.main.temp) : this.maxTemp;
            this.minTemp = res.main.temp < this.minTemp ? Math.round(res.main.temp) : this.minTemp;
      }
    })
  }

  @Input() addMode;
  @Output() cityStored = new EventEmitter();
  citesWeather:Object;
  darkMode:boolean;
  sub1:Subscription;
  state: string;
  temp: number;
  maxTemp: number;
  minTemp: number;
  errorMessage: string;
  cityName;
  cityAdded = false;
  constructor(public weather: WeatherService,public router: Router,
    public ui: UiService,public fb: FbService) { }

  ngOnInit() {
    this.sub1 = this.ui.darkModeState.subscribe((isDark) => {
      this.darkMode = isDark;
    })
  }
  ngOnDestroy(){
    this.sub1.unsubscribe();
  }
  openDetails(){
    if(!this.addMode){
      this.router.navigateByUrl('/details/'+this.cityName);
    }
  }
  addCity() {
    this.fb.addCity(this.cityName).subscribe(() => {
      this.cityName = null;
      this.maxTemp = null;
      this.minTemp = null;
      this.state = null;
      this.temp = null;
      this.cityAdded = true;
      this.cityStored.emit();
      setTimeout(() => this.cityAdded = false, 2000);
    });
    this.addMode = !this.addMode;
  }
}
