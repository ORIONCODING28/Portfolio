import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="flex items-center justify-center"
      [class]="containerClass()"
    >
      <div 
        class="relative"
        [style.width.px]="size()"
        [style.height.px]="size()"
      >
        <!-- Outer ring -->
        <div 
          class="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          [style.borderTopColor]="'var(--color-electric-violet)'"
          [style.borderRightColor]="'var(--color-soft-cyan)'"
          [style.animationDuration]="'1s'"
        ></div>
        
        <!-- Inner ring -->
        <div 
          class="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
          [style.borderBottomColor]="'var(--color-teal)'"
          [style.borderLeftColor]="'var(--color-electric-violet)'"
          [style.animationDuration]="'0.7s'"
          [style.animationDirection]="'reverse'"
        ></div>
        
        <!-- Center dot -->
        <div 
          class="absolute inset-0 m-auto w-2 h-2 rounded-full bg-electric-violet animate-pulse"
        ></div>
      </div>

      @if (text()) {
        <span 
          class="ml-3 text-gray-300"
          [class.text-sm]="size() < 40"
        >
          {{ text() }}
        </span>
      }
    </div>
  `
})
export class LoadingSpinnerComponent {
  size = input<number>(40);
  text = input<string>('');
  containerClass = input<string>('');
}
