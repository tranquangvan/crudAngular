import { Component, OnInit, OnDestroy } from '@angular/core';
import {UiService} from '../app/ui.service';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  showMenu = false;
  darkModeActive: boolean;
  userEmail = '';
  sub1 : Subscription;
  constructor(public ui:UiService,public router: Router){

  }
  ngOnInit(){
    this.sub1 = this.ui.darkModeState.subscribe((value) => {
      this.darkModeActive = value;
    });

  }
  toggleMenu(){
    this.showMenu = !this.showMenu;
  }
  modeToggleSwitch(){
    this.ui.darkModeState.next(!this.darkModeActive);
  }
  ngOnDestroy(){
    this.sub1.unsubscribe();
  }
}
