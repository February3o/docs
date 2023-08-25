import { Component, OnInit } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    anime({
      targets: '.twitter',
      translateX: 100,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });

    anime({
      targets: '.card-container .card',
      scale: [
        { value: .01, easing: 'easeOutSine', duration: 600 },
        { value: 1, easing: 'easeOutSine', duration: 600 }
      ],
      delay: anime.stagger(200, { from: 'first' })
    });

    // anime({
    //   targets: '',
    //   translateX: -270,
    //   rotate: anime.stagger([-360, 360]),
    //   easing: 'easeInOutQuad'
    // });
  }

}
