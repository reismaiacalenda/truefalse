import { animate, animateChild, group, query as q, style, transition, trigger } from '@angular/animations';
const query = (s,a,o={optional:true})=>q(s,a,o);

export const routerTransition = trigger('routerTransition', [
  // transition('* => *', [
  //   query(':enter, :leave', style({ position: 'fixed', width:'100%',height:'100%' })),
  //   query(':enter', style({ transform: 'translateX(100%)' })),
    
  //   group([
  //     query(':leave', [
  //       style({ transform: 'translateX(0%)' }),
  //       animate('.5s ease-in-out', style({transform: 'translatey(-100%)'}))
  //     ]),
  //     query(':enter', [
  //       animate('0.5s ease-in-out', style({transform: 'translateX(0%)'})),
  //       animateChild()
  //     ])
  //   ]),
  // ]),
]);

// export const pageAnimation = trigger('pageAnimation', [
//   transition(':enter', [
//     query('h1', [
//       style({ transform: 'scale(0)' }),
//       animate('0.5s', style('*'))
//     ], {optional:true})
//   ]),
// ]);
/*
export const routerTransition = trigger('routerTransition', [
  transition('* => *', [
    query(':enter, :leave', style({ position: 'fixed', width:'100%',height:'100%' }), {optional:true}),
    query(':enter', style({ transform: 'translateX(100%)' }), {optional:true}),
    
    group([
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('1.0s ease-in-out', style({transform: 'translateX(-100%)'}))
      ], {optional:true}),
      query(':enter', animate('1.0s ease-in-out', style({transform: 'translateX(0%)'})), {optional:true}),
      //query(':enter', animateChild(), {optional:true})
    ]),
    //query(':enter', animateChild(), {optional:true}),
  ])
  
]);
*/