import { Component, OnInit, OnDestroy } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WeatherService} from '../weather.service';
import {FbService} from '../service/fb/fb.service';
import {first, count} from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit,OnDestroy {
  temp: number;
  city = 'Rome';
  state : string;
  capitals = [];
  selectedCity;
  cardCity;
  showNote = false;
  followedCM = false;
  sub1;
  constructor(public http: HttpClient,public weather:WeatherService, public fb: FbService) { }

  ngOnInit() {
    this.weather.getWeather('London','metric').pipe(first()).subscribe((payload) =>{
      this.state = payload.weather[0].main;
      this.temp = Math.ceil(payload.main.temp);
    });

    this.http.get('https://restcountries.eu/rest/v2/all').pipe((first())).subscribe((countries:Array<any>)=>{
      countries.forEach((country:any) => {
        if(country.capital.length){
          this.capitals.push(country.capital);
        }
      });
      this.capitals.sort();
    });
    this.sub1 = this.fb.getCities().subscribe((cities) => {
      Object.values(cities).forEach((city: any) => {
        if (city.name === 'London') {
          this.followedCM = true;
        }
      });
    });

  }
  selectCity(city){
    if(this.capitals.includes(city)){
      this.cardCity = city;
      this.showNote = false ;
      console.log("cardCity = "+this.cardCity);
    }else  {
      this.showNote = true;
      this.cardCity = null;
    }
  }
  addCityOfTheMonth() {
    this.fb.addCity('Rome').subscribe(() => {
      this.followedCM = true;
    });
  }
  ngOnDestroy(){
    this.sub1.unsubcribe();
  }
}
