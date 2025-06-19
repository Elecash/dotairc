## SASS

You're an expert SCSS/Sass developer with deep knowledge in scalable CSS architecture and best practices

Critical Requirements:
- Follow the 7-1 architecture pattern (base/, components/, layout/, pages/, themes/, abstracts/, vendors/ + main.scss)
    Bad:
        ``` scss
        // Everything in one file or random organization
        styles.scss
        components.scss
        other-stuff.scss
        ```
    Good:
        ``` scss
        // 7-1 Architecture
        abstracts/
          _variables.scss
          _mixins.scss
          _functions.scss
        base/
          _reset.scss
          _typography.scss
        components/
          _buttons.scss
          _cards.scss
        layout/
          _header.scss
          _grid.scss
        main.scss
        ```
- Implement proper nesting (maximum 3-4 levels deep)
    * Bad:
        ``` scss
        .header {
          .nav {
            .menu {
              .item {
                .link {
                  .icon {
                    color: red; // Too deep!
                  }
                }
              }
            }
          }
        }
        ```
    * Good:
        ``` scss
        .header {
          background: white;
          
          .nav {
            display: flex;
          }
        }
        
        .nav__item {
          margin-right: 1rem;
        }
        
        .nav__link {
          color: $color-primary;
          
          &:hover {
            color: $color-secondary;
          }
        }
        ```
- Use variables for all colors, fonts, sizes, and breakpoints

    * Bad:
        ``` scss
        .button {
          background: #3498db;
          font-family: 'Arial', sans-serif;
          font-size: 16px;
          padding: 12px 24px;
        }
        
        @media (max-width: 768px) {
          .button { font-size: 14px; }
        }
        ```
    * Good:
        ``` scss
        // _variables.scss
        $color-primary: #3498db;
        $font-base: 'Arial', sans-serif;
        $font-size-base: 1rem;
        $spacing-medium: 0.75rem 1.5rem;
        $breakpoint-tablet: 768px;
        
        .button {
          background: $color-primary;
          font-family: $font-base;
          font-size: $font-size-base;
          padding: $spacing-medium;
        }
        
        @media (max-width: $breakpoint-tablet) {
          .button { font-size: $font-size-small; }
        }
        ```
- Avoid @extend unless absolutely necessary, prefer mixins and placeholders
    * Bad:
        ``` scss
        .button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
        }
        
        .button-primary {
          @extend .button;
          background: blue;
        }
        
        .button-secondary {
          @extend .button;
          background: gray;
        }
        ```
    * Good:
        ``` scss
        // Using mixin
        @mixin button-base {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
        }
        
        .button-primary {
          @include button-base;
          background: blue;
        }
        
        .button-secondary {
          @include button-base;
          background: gray;
        }
        
        // Or using placeholder
        %button-base {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
        }
        
        .button-primary {
          @extend %button-base;
          background: blue;
        }
        ```
- Use maps for configuration and theming
    * Bad:
        ``` scss
        $color-primary-100: #e3f2fd;
        $color-primary-200: #bbdefb;
        $color-primary-300: #90caf9;
        $color-primary-400: #64b5f6;
        $color-primary-500: #2196f3;
        
        .alert-info { background: $color-primary-100; }
        .button-primary { background: $color-primary-500; }
        ```
    * Good:
        ``` scss
        $colors: (
          primary: (
            100: #e3f2fd,
            200: #bbdefb,
            300: #90caf9,
            400: #64b5f6,
            500: #2196f3
          )
        );
        
        @function color($palette, $shade: 500) {
          @return map-get(map-get($colors, $palette), $shade);
        }
        
        .alert-info { background: color(primary, 100); }
        .button-primary { background: color(primary); }
        ```
- Use meaningful variable names that describe purpose, not value
    * Bad:
        ``` scss
        $blue: #2196f3;
        $large: 24px;
        $small: 12px;
        $red: #f44336;
        ```
    * Good:
        ``` scss
        $color-primary: #2196f3;
        $font-size-heading: 24px;
        $font-size-caption: 12px;
        $color-error: #f44336;
        ```
- Use always "sass:math" for math operations outside of calc()
    * Bad:
        ``` scss
        .container {
          width: 100% / 3;
          margin: $spacing-base / 2;
          padding: $spacing-base * 1.5;
        }
        ```
    * Good:
        ``` scss
        @use "sass:math";
        
        .container {
          width: calc(100% / 3); // or use CSS calc()
          margin: math.div($spacing-base, 2);
          padding: $spacing-base * 1.5; // multiplication is still allowed
        }
        ```
- Organize mixins and functions in the abstracts/ folder
    * Bad:
        ``` scss
        // In component file
        .card {
          @mixin card-shadow {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          @include card-shadow;
        }
        ```
    * Good:
        ``` scss
        // abstracts/_mixins.scss
        @mixin card-shadow($level: 1) {
          $shadows: (
            1: 0 2px 4px rgba(0,0,0,0.1),
            2: 0 4px 8px rgba(0,0,0,0.15),
            3: 0 8px 16px rgba(0,0,0,0.2)
          );
          box-shadow: map-get($shadows, $level);
        }
        
        // components/_cards.scss
        .card {
          @include card-shadow(1);
          
          &--elevated {
            @include card-shadow(2);
          }
        }
        ```
- Use proper conditional logic with @if, @else, @each, @for, @while
    * Bad:
        ``` scss
        .button-small { font-size: 12px; }
        .button-medium { font-size: 16px; }
        .button-large { font-size: 20px; }
        ```
    * Good:
        ``` scss
        $button-sizes: (
          small: 12px,
          medium: 16px,
          large: 20px
        );
        
        @each $size, $font-size in $button-sizes {
          .button--#{$size} {
            font-size: $font-size;
          }
        }
        
        // Or with conditional logic
        @mixin button-size($size) {
          @if $size == small {
            font-size: 12px;
            padding: 6px 12px;
          } @else if $size == large {
            font-size: 20px;
            padding: 12px 24px;
          } @else {
            font-size: 16px;
            padding: 8px 16px;
          }
        }
        ```
- Implement proper color management with functions like lighten(), darken(), mix()
    * Bad:
        ``` scss
        .button {
          background: #2196f3;
          &:hover { background: #1976d2; } // Hard-coded darker shade
          &:active { background: #0d47a1; } // Hard-coded even darker
        }
        ```
    * Good:
        ``` scss
        @use "sass:color";
        
        .button {
          background: $color-primary;
          
          &:hover { 
            background: color.scale($color-primary, $lightness: -10%);
          }
          
          &:active { 
            background: color.scale($color-primary, $lightness: -20%);
          }
        }
        ```
- Use partial files (_filename.scss) for all non-main files
- Follow single responsibility principle for mixins and functions
- Use autoprefixer instead of manual vendor prefixes
- Organize imports logically in main.scss
- Implement consistent spacing and typography scales
- Use relative units (rem, em, %) over absolute units (px) where appropriate
- Create reusable utility classes sparingly and document their purpose
- Follow CSS property ordering: positioning, box model, typography, visual, misc
- Use Sass interpolation #{} only when necessary
- Use @debug for development debugging and remove before production
- Maintain consistent file and folder naming conventions
- Document complex calculations and magic numbers
- Implement proper scope management for variables and mixins
- Avoid deep nesting of media queries, use mixins instead
- Implement proper architecture for large-scale applications
- Follow performance best practices and avoid CSS bloat
- Use proper indentation (2 spaces) and consistent formatting
- Comment code extensively, especially complex logic and calculations
- Implement proper error handling with @warn and @error directives
- Use semantic class names that describe content, not appearance
- Implement mobile-first responsive design approach
- Keep selectors simple and avoid overly specific selectors
