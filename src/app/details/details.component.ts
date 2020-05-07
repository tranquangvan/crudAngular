import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {WeatherService} from '../weather.service';
import{UiService} from '../ui.service';
import {forkJoin, Observable} from 'rxjs';
import {concatMap} from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit,OnDestroy{
  daysForecast: Object;
  darkMode: boolean;
  city : string;
  state : string;
  temp : number;
  hum: number;
  wind : number;
  today : string;
  day1Name : string;
  day1State : string;
  day1Temp: number;
  cityIllustrationPath: string;
  day2Name: string;
  day2State: string;
  day2Temp: number;

  day3Name: string;
  day3State: string;
  day3Temp: number;

  day4Name: string;
  day4State: string;
  day4Temp: number;

  day5Name: string;
  day5State: string;
  day5Temp: number;

  errorMessage: string;
  tweets$: Observable<any>;

  sub1: Subscription;
  sub2:Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;
  public weathers;
  statesForecast :Object;
  tempsForecast:Object;
  constructor(public activeRouter:ActivatedRoute,public weather: WeatherService,public ui:UiService) {
  }

  ngOnInit() {
    this.cityIllustrationPath = '../../assets/cities/france.svg';

      this.sub2 = this.ui.darkModeState.subscribe((isDark) => {
      this.darkMode = isDark;
    })
    const todayNumberInWeek = new Date().getDay();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.today = days[todayNumberInWeek];
    // this.sub5 = this.weather.getForecast('London','metric').subscribe((data:any) => {
    //     this.weathers = data;
    //     console.log(data);
    //   });
      this.activeRouter.paramMap.subscribe((route:any) => {
        this.city = 'London';
         this.sub1 =this.weather.getWeather('London','metric').subscribe(data =>{
           this.state = data.weather[0].description;
           this.temp = data.main.temp;
           this.hum = data.main.humidity;
           this.wind = data.wind.speed;
           this.sub5 = this.weather.getForecast('London','metric').subscribe((data:any) => {
                console.log(data);

                for (let i=0;i < data.length;i++){
                  const date = new Date(data[i].dt_txt).getDay();
                  console.log(days[date]);
                  if(((date === todayNumberInWeek + 1) || (todayNumberInWeek===6 && date ===0))&& !this.day1Name){
                    this.day1Name = days[date];
                    this.day1State = data[i].weather[0].main;
                    this.day1Temp = Math.round(data[i].main.temp);
                  }
                  else if(!!this.day1Name && !this.day2Name && days[date]!== this.day1Name){
                    this.day2Name = days[date];
                    this.day2State = data[i].weather[0].main;
                    this.day2Temp = Math.round(data[i].main.temp);
                  }
                  else if(!!this.day2Name && !this.day3Name && days[date]!== this.day2Name){
                    this.day3Name = days[date];
                    this.day3State = data[i].weather[0].main;
                    this.day3Temp = Math.round(data[i].main.temp);
                  }
                  else if(!!this.day3Name && !this.day4Name && days[date]!==this.day3Name){
                    this.day4Name = days[date];
                    this.day4State = data[i].weather[0].main;
                    this.day4Temp = Math.round(data[i].main.temp);
                  }
                  else if(!!this.day4Name && !this.day5Name && days[date]!==this.day4Name){
                    this.day5Name = days[date];
                    this.day5State = data[i].weather[0].main;
                    this.day5Temp = Math.round(data[i].main.temp);
                  }
                }
                this.statesForecast=[this.day1State,this.day2State,this.day3State,this.day4State];
                this.tempsForecast = [this.day1Temp,this.day2Temp,this.day3Temp,this.day4Temp];
                this.daysForecast =[this.day1Name,this.day2Name,this.day3Name,this.day4Name];
                console.log("state:" + this.statesForecast);
               });

        })

      })
  }
  ngOnDestroy(){
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub5.unsubscribe();
  }
}
