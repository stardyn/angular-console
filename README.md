# @stardyn/angular-console

Lightweight, configurable console logging service for Angular applications. Provides advanced debugging features with minimal performance impact.

## Features

- **Dual Service Structure**: App-level and Module-level separate console services
- **Performance Focused**: Zero overhead when debug mode is disabled
- **Rich Formatting**: Automatic prefix with timestamp, app/module version
- **Performance Tracking**: Timing for synchronous and asynchronous operations
- **Runtime Control**: Dynamically enable/disable debug mode
- **Lifecycle Logging**: Component and module lifecycle tracking
- **API Call Tracking**: Lightweight logging of HTTP requests
- **State Change Monitoring**: Track component state changes
- **Production Ready**: Automatically disable logs in production

## Installation

```bash
npm install @stardyn/angular-console
```

## Quick Start

### 1. App-Level Console Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { ConsoleService } from '@stardyn/angular-console';

@Component({
    selector: 'app-root',
    template: `
    <h1>{{ title }}</h1>
    <button (click)="testConsole()">Test Console</button>
  `
})
export class AppComponent implements OnInit {
    title = 'My Stardyn App';

    constructor(private console: ConsoleService) {}

    ngOnInit() {
        // Configure console service
        this.console.configure({
            appName: 'MyStardynApp',
            version: '2.1.0',
            debugMode: true,
            showTimestamp: true
        });

        this.console.logLifecycle('App Initialized');
        this.console.info('Application started successfully');
    }

    testConsole() {
        this.console.log('This is a log message');
        this.console.info('This is an info message');
        this.console.warn('This is a warning');
        this.console.error('This is an error');
        this.console.debug('This is a debug message');

        // User action logging
        this.console.logUserAction('Button Click', 'Test Console Button');
    }
}
```

### 2. Module-Level Console Usage

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideStardynConsoleModule, ModuleConsoleService } from '@stardyn/angular-console';

@NgModule({
  imports: [CommonModule],
  providers: [
    provideStardynConsoleModule({
      moduleName: 'UserModule',
      version: '1.2.0',
      debugMode: true,
      showTimestamp: true
    })
  ]
})
export class UserModule {
  constructor(private console: ModuleConsoleService) {
    this.console.logModuleInit('UserModule', ['UserList', 'UserDetail', 'UserForm']);
  }
}
```

### 3. Standalone Component Usage

```typescript
import { Component } from '@angular/core';
import { provideStardynConsoleModule, ModuleConsoleService } from '@stardyn/angular-console';

@Component({
  selector: 'app-product',
  standalone: true,
  providers: [
    provideStardynConsoleModule({
      moduleName: 'ProductModule',
      version: '2.0.0',
      debugMode: true
    })
  ],
  template: `
    <div>
      <h2>Product Component</h2>
      <button (click)="loadProducts()">Load Products</button>
    </div>
  `
})
export class ProductComponent {
  constructor(private console: ModuleConsoleService) {
    this.console.logLifecycle('Product Component Initialized');
  }

  loadProducts() {
    this.console.logUserAction('Load Products', 'Button clicked');

    const products = this.console.time('Load Products', () => {
      // Product loading simulation
      return Array.from({length: 100}, (_, i) => ({id: i, name: `Product ${i}`}));
    });

    this.console.info('Products loaded:', products.length);
  }
}
```

## API Reference

### ConsoleService

#### Configuration

```typescript
interface ConsoleConfig {
  appName?: string;        // Default: 'StardynApp'
  version?: string;        // Default: '1.0.0'
  debugMode?: boolean;     // Default: true
  showTimestamp?: boolean; // Default: true
}

// Configuration
console.configure(config: Partial<ConsoleConfig>): void
```

#### Basic Logging Methods

```typescript
console.log(...args: any[]): void
console.info(...args: any[]): void
console.warn(...args: any[]): void
console.error(...args: any[]): void
console.debug(...args: any[]): void
```

#### Performance Tracking

```typescript
// Synchronous operations
const result = console.time('Operation Name', () => {
  // Code to be timed
  return someCalculation();
});

// Asynchronous operations
const result = await console.timeAsync('Async Operation', async () => {
  // Async code
  return await apiCall();
});

// Manual performance logging
console.logPerformance('Operation Name', timeInMs);
```

#### Special Logging Methods

```typescript
// Lifecycle events
console.logLifecycle('Component Initialized');

// API calls
console.logApiCall('GET', '/api/users', 200, 150.5);

// State changes
console.logStateChange('ComponentName', 'propertyName', newValue);

// User actions
console.logUserAction('Button Click', 'Save Button');

// Navigation
console.logNavigation('/home', '/users');

// Error logging
console.logError('Operation failed', errorObject);
```

#### Debug Control

```typescript
// Check debug mode
console.isDebugEnabled(): boolean

// Enable/disable debug mode
console.enableDebug(): void
console.disableDebug(): void

// Get configuration
console.getConfig(): ConsoleConfig
```

#### Grouped Logging

```typescript
console.group('API Calls', () => {
  console.info('Starting API calls');
  console.logApiCall('GET', '/api/users');
  console.logApiCall('POST', '/api/orders');
});
```

### ModuleConsoleService

ModuleConsoleService has the same API as ConsoleService, but is designed for module-level logging.

```typescript
interface ModuleConsoleConfig {
  moduleName?: string;     // Default: 'StardynModule'
  version?: string;        // Default: '1.0.0'
  debugMode?: boolean;     // Default: true
  showTimestamp?: boolean; // Default: true
}
```

Additional methods:

```typescript
// Module initialization
console.logModuleInit(moduleName: string, features?: string[]): void

// Service initialization
console.logServiceInit(serviceName: string, config?: any): void
```

## Usage Examples

### Service Usage

```typescript
import { Injectable } from '@angular/core';
import { ConsoleService } from '@stardyn/angular-console';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private console: ConsoleService) {}

  async getUsers() {
    this.console.debug('UserService: Fetching users...');

    try {
      const users = await this.console.timeAsync('Fetch Users', async () => {
        const response = await fetch('/api/users');
        return response.json();
      });

      this.console.logApiCall('GET', '/api/users', 200);
      this.console.info('Users loaded successfully', users.length, 'users found');

      return users;
    } catch (error) {
      this.console.logError('Failed to load users', error as Error);
      throw error;
    }
  }
}
```

### Component State Tracking

```typescript
import { Component } from '@angular/core';
import { ConsoleService } from '@stardyn/angular-console';

@Component({
  selector: 'app-user-list',
  template: '...'
})
export class UserListComponent {
  private _selectedUser: any = null;

  constructor(private console: ConsoleService) {}

  set selectedUser(user: any) {
    this.console.logStateChange('UserListComponent', 'selectedUser', user?.id);
    this._selectedUser = user;
  }

  get selectedUser() {
    return this._selectedUser;
  }

  onUserClick(user: any) {
    this.console.logUserAction('User Selected', `User ID: ${user.id}`);
    this.selectedUser = user;
  }
}
```

### Production Configuration

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ConsoleService } from '@stardyn/angular-console';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    // Other providers...
  ]
}).then(appRef => {
  const console = appRef.injector.get(ConsoleService);

  // Disable debug mode in production
  if (environment.production) {
    console.configure({ debugMode: false });
  }
});
```

## Console Output Examples

When debug mode is enabled, console outputs appear in this format:

```
[14:30:25][MyStardynApp v2.1.0] ═══════════════════════════════
    LIFECYCLE: App Initialized
═══════════════════════════════

[14:30:25][MyStardynApp v2.1.0] Application started successfully

[14:30:26][MyStardynApp v2.1.0] USER ACTION: Button Click - Test Console Button

[14:30:26][MyStardynApp v2.1.0] Performance [Load Products]: 15.30ms

[14:30:26][MyStardynApp v2.1.0] API GET /api/users [200] (150.50ms)

[14:30:26][UserModule v1.2.0] [UserListComponent] State Change: selectedUser = 123
```

## Performance

- **Debug Mode Off**: Zero overhead - all log calls return early
- **Debug Mode On**: Minimal overhead - only necessary formatting
- **Memory Friendly**: No stack traces or large objects logged
- **Production Ready**: Environment-based automatic debug mode control

## TypeScript Support

Full TypeScript support with intellisense and type safety:

```typescript
// Strong typing
const config: ConsoleConfig = {
  appName: 'MyStardynApp',
  version: '1.0.0',
  debugMode: true,
  showTimestamp: true
};

// Method overloading
console.log('String message');
console.log('Multiple', 'arguments', {key: 'value'});
console.log('Mixed', 123, true, {data: 'object'});
```
