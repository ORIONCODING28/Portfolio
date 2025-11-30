import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  stagger,
  state,
  keyframes,
  group,
  animateChild,
  AnimationTriggerMetadata
} from '@angular/animations';

// ==========================================
// FADE ANIMATIONS
// ==========================================

export const fadeIn: AnimationTriggerMetadata = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0 }))
  ])
]);

export const fadeInUp: AnimationTriggerMetadata = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(30px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
  ])
]);

export const fadeInDown: AnimationTriggerMetadata = trigger('fadeInDown', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-30px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const fadeInLeft: AnimationTriggerMetadata = trigger('fadeInLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-50px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

export const fadeInRight: AnimationTriggerMetadata = trigger('fadeInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(50px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

// ==========================================
// SCALE ANIMATIONS
// ==========================================

export const scaleIn: AnimationTriggerMetadata = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
  ])
]);

export const zoomIn: AnimationTriggerMetadata = trigger('zoomIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.5)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

// ==========================================
// SLIDE ANIMATIONS
// ==========================================

export const slideInUp: AnimationTriggerMetadata = trigger('slideInUp', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('400ms ease-out', style({ transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(100%)' }))
  ])
]);

export const slideInDown: AnimationTriggerMetadata = trigger('slideInDown', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('400ms ease-out', style({ transform: 'translateY(0)' }))
  ])
]);

export const slideInLeft: AnimationTriggerMetadata = trigger('slideInLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('400ms ease-out', style({ transform: 'translateX(0)' }))
  ])
]);

export const slideInRight: AnimationTriggerMetadata = trigger('slideInRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('400ms ease-out', style({ transform: 'translateX(0)' }))
  ])
]);

// ==========================================
// STAGGER ANIMATIONS
// ==========================================

export const staggerFadeIn: AnimationTriggerMetadata = trigger('staggerFadeIn', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('100ms', [
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const staggerScaleIn: AnimationTriggerMetadata = trigger('staggerScaleIn', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'scale(0.8)' }),
      stagger('80ms', [
        animate('350ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ], { optional: true })
  ])
]);

// ==========================================
// HOVER ANIMATIONS
// ==========================================

export const cardHover: AnimationTriggerMetadata = trigger('cardHover', [
  state('default', style({ 
    transform: 'translateY(0)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  })),
  state('hovered', style({ 
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(157, 78, 221, 0.3)'
  })),
  transition('default <=> hovered', animate('300ms ease-out'))
]);

export const buttonHover: AnimationTriggerMetadata = trigger('buttonHover', [
  state('default', style({ transform: 'scale(1)' })),
  state('hovered', style({ transform: 'scale(1.05)' })),
  transition('default <=> hovered', animate('200ms ease-out'))
]);

// ==========================================
// SPECIAL ANIMATIONS
// ==========================================

export const pulse: AnimationTriggerMetadata = trigger('pulse', [
  transition('* => *', [
    animate('1s ease-in-out', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.05)', offset: 0.5 }),
      style({ transform: 'scale(1)', offset: 1 })
    ]))
  ])
]);

export const shake: AnimationTriggerMetadata = trigger('shake', [
  transition('* => *', [
    animate('500ms ease-in-out', keyframes([
      style({ transform: 'translateX(0)', offset: 0 }),
      style({ transform: 'translateX(-10px)', offset: 0.2 }),
      style({ transform: 'translateX(10px)', offset: 0.4 }),
      style({ transform: 'translateX(-10px)', offset: 0.6 }),
      style({ transform: 'translateX(10px)', offset: 0.8 }),
      style({ transform: 'translateX(0)', offset: 1 })
    ]))
  ])
]);

export const float: AnimationTriggerMetadata = trigger('float', [
  state('up', style({ transform: 'translateY(-10px)' })),
  state('down', style({ transform: 'translateY(0)' })),
  transition('up <=> down', animate('2s ease-in-out'))
]);

export const rotate3d: AnimationTriggerMetadata = trigger('rotate3d', [
  state('front', style({ transform: 'rotateY(0deg)' })),
  state('back', style({ transform: 'rotateY(180deg)' })),
  transition('front <=> back', animate('600ms ease-in-out'))
]);

// ==========================================
// PAGE TRANSITIONS
// ==========================================

export const routeAnimation: AnimationTriggerMetadata = trigger('routeAnimation', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ], { optional: true }),
      query(':enter', [
        animate('400ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);

// ==========================================
// NAVBAR ANIMATIONS
// ==========================================

export const navbarSlide: AnimationTriggerMetadata = trigger('navbarSlide', [
  state('visible', style({ transform: 'translateY(0)' })),
  state('hidden', style({ transform: 'translateY(-100%)' })),
  transition('visible <=> hidden', animate('300ms ease-out'))
]);

export const mobileMenuSlide: AnimationTriggerMetadata = trigger('mobileMenuSlide', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
  ])
]);

// ==========================================
// TYPING ANIMATION
// ==========================================

export const typingCursor: AnimationTriggerMetadata = trigger('typingCursor', [
  state('visible', style({ opacity: 1 })),
  state('hidden', style({ opacity: 0 })),
  transition('visible <=> hidden', animate('500ms'))
]);

// ==========================================
// LOADING ANIMATIONS
// ==========================================

export const spinnerRotate: AnimationTriggerMetadata = trigger('spinnerRotate', [
  state('*', style({ transform: 'rotate(0deg)' })),
  transition('* => *', [
    animate('1s linear', style({ transform: 'rotate(360deg)' }))
  ])
]);

// Export all animations as a collection
export const PORTFOLIO_ANIMATIONS = [
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  zoomIn,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  staggerFadeIn,
  staggerScaleIn,
  cardHover,
  buttonHover,
  pulse,
  shake,
  float,
  rotate3d,
  routeAnimation,
  navbarSlide,
  mobileMenuSlide,
  typingCursor,
  spinnerRotate
];
