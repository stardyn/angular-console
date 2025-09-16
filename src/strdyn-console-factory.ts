import {Provider} from '@angular/core';
import {ModuleConsoleService, ModuleConsoleConfig} from './strdyn-module.console';
import {ConsoleConfig, ConsoleService} from "./strdyn-console";

export const CONSOLE_CONFIG = 'CONSOLE_CONFIG';

/**
 * Factory function to create a ConsoleService with configuration
 * @param config Console configuration for the app
 * @returns Configured ConsoleService instance
 */
function createConsole(config: ConsoleConfig): ConsoleService {
    const console = new ConsoleService();
    console.configure(config);
    return console;
}

export function provideStardynConsole(config: ConsoleConfig): Provider[] {
    return [
        {
            provide: CONSOLE_CONFIG,
            useValue: config
        },
        {
            provide: ConsoleService,
            useFactory: (configValue: ConsoleConfig) => createConsole(configValue),
            deps: [CONSOLE_CONFIG]
        }
    ];
}

function createModuleConsole(config: ModuleConsoleConfig): ModuleConsoleService {
    const console = new ModuleConsoleService();
    console.configure(config);
    return console;
}

/**
 * Token for providing module console with custom config
 */
export const MODULE_CONSOLE_CONFIG = 'MODULE_CONSOLE_CONFIG';

/**
 * Provider for injecting console config
 * @param config Console configuration
 * @returns Angular Provider
 */
export function provideStardynConsoleModule(config: ModuleConsoleConfig): Provider[] {
    return [
        {
            provide: MODULE_CONSOLE_CONFIG,
            useValue: config
        },
        {
            provide: ModuleConsoleService,
            useFactory: (configValue: ModuleConsoleConfig) => createModuleConsole(configValue),
            deps: [MODULE_CONSOLE_CONFIG]
        }
    ];
}