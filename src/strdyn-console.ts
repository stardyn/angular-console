import { Injectable } from '@angular/core';

export interface ConsoleConfig {
    appName?: string;
    version?: string;
    debugMode?: boolean;
    showTimestamp?: boolean;
}

@Injectable()
export class ConsoleService {
    private config: ConsoleConfig = {
        appName: 'StardynApp',
        version: '1.0.0',
        debugMode: true,
        showTimestamp: true
    };

    constructor() {}

    /**
     * Configure the console service
     * @param config Configuration options
     */
    public configure(config: Partial<ConsoleConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Format message with app name, version and timestamp prefix
     * @param args Arguments to log
     * @returns Formatted string
     */
    private formatMessage(...args: any[]): string {
        let prefix = '';

        if (this.config.showTimestamp) {
            const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
            prefix += `[${timestamp}]`;
        }

        prefix += `[${this.config.appName} v${this.config.version}]`;

        // Convert all arguments to string and join them
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');

        return `${prefix} ${message}`;
    }

    /**
     * Check if logging is enabled based on debug mode
     */
    private isLoggingEnabled(): boolean {
        return this.config.debugMode === true;
    }

    /**
     * Enhanced console.log - only for our app logs
     * @param args Arguments to log
     */
    public log(...args: any[]): void {
        if (!this.isLoggingEnabled()) return;

        const formattedMessage = this.formatMessage(...args);
        console.log(formattedMessage);
    }

    /**
     * Enhanced console.info - only for our app logs
     * @param args Arguments to log
     */
    public info(...args: any[]): void {
        if (!this.isLoggingEnabled()) return;

        const formattedMessage = this.formatMessage(...args);
        console.info(formattedMessage);
    }

    /**
     * Enhanced console.warn - only for our app logs
     * @param args Arguments to log
     */
    public warn(...args: any[]): void {
        if (!this.isLoggingEnabled()) return;

        const formattedMessage = this.formatMessage(...args);
        console.warn(formattedMessage);
    }

    /**
     * Enhanced console.error - only for our app logs
     * @param args Arguments to log
     */
    public error(...args: any[]): void {
        if (!this.isLoggingEnabled()) return;

        const formattedMessage = this.formatMessage(...args);
        console.error(formattedMessage);
    }

    /**
     * Enhanced console.debug - only for our app logs
     * @param args Arguments to log
     */
    public debug(...args: any[]): void {
        if (!this.isLoggingEnabled()) return;

        const formattedMessage = this.formatMessage(...args);
        console.debug(formattedMessage);
    }

    /**
     * Log performance information
     * @param operation Operation name
     * @param timeMs Time in milliseconds
     */
    public logPerformance(operation: string, timeMs: number): void {
        if (!this.isLoggingEnabled()) return;

        this.debug(`Performance [${operation}]: ${timeMs.toFixed(2)}ms`);
    }

    /**
     * Time an operation and log the result
     * @param name Operation name
     * @param fn Function to time
     * @returns The result of the function
     */
    public time<T>(name: string, fn: () => T): T {
        if (!this.isLoggingEnabled()) {
            // Just run the function, no timing
            return fn();
        }

        const start = performance.now();
        const result = fn();
        const end = performance.now();
        this.logPerformance(name, end - start);
        return result;
    }

    /**
     * Time an async operation and log the result
     * @param name Operation name
     * @param fn Async function to time
     * @returns Promise resolving to the function result
     */
    public async timeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
        if (!this.isLoggingEnabled()) {
            // Just run the function, no timing
            return await fn();
        }

        const start = performance.now();
        try {
            const result = await fn();
            const end = performance.now();
            this.logPerformance(name, end - start);
            return result;
        } catch (error) {
            const end = performance.now();
            this.logPerformance(`${name} (failed)`, end - start);
            throw error;
        }
    }

    /**
     * Create a grouped log
     * @param groupName Group name
     * @param logFn Function containing log calls
     */
    public group(groupName: string, logFn: () => void): void {
        if (!this.isLoggingEnabled()) return;

        console.group(this.formatMessage(groupName));
        logFn();
        console.groupEnd();
    }

    /**
     * Creates console log entries that clearly show lifecycle events
     * useful for debugging
     * @param name Name of lifecycle event
     */
    public logLifecycle(name: string): void {
        if (!this.isLoggingEnabled()) return;

        const separator = "═".repeat(30);
        this.log(`\n${separator}\n    LIFECYCLE: ${name}\n${separator}`);
    }

    /**
     * Log API calls with request/response details - lightweight version
     * @param method HTTP method
     * @param url Request URL
     * @param status HTTP status code (optional)
     * @param responseTime Response time in ms (optional)
     */
    public logApiCall(
        method: string,
        url: string,
        status?: number,
        responseTime?: number
    ): void {
        if (!this.isLoggingEnabled()) return;

        let message = `API ${method.toUpperCase()} ${url}`;
        if (status) {
            message += ` [${status}]`;
        }
        if (responseTime) {
            message += ` (${responseTime.toFixed(2)}ms)`;
        }

        this.debug(message);
    }

    /**
     * Log component state changes - lightweight version
     * @param componentName Component name
     * @param stateName State property name
     * @param newValue New value (optional for privacy)
     */
    public logStateChange(
        componentName: string,
        stateName: string,
        newValue?: any
    ): void {
        if (!this.isLoggingEnabled()) return;

        let message = `[${componentName}] State Change: ${stateName}`;
        if (newValue !== undefined) {
            message += ` = ${typeof newValue === 'object' ? '[Object]' : newValue}`;
        }

        this.debug(message);
    }

    /**
     * Enable debug mode
     */
    public enableDebug(): void {
        this.config.debugMode = true;
        this.info('Debug mode enabled');
    }

    /**
     * Disable debug mode
     */
    public disableDebug(): void {
        this.info('Debug mode disabled');
        this.config.debugMode = false;
    }

    /**
     * Get current configuration
     */
    public getConfig(): ConsoleConfig {
        return { ...this.config };
    }

    /**
     * Check if debug mode is enabled
     */
    public isDebugEnabled(): boolean {
        return this.isLoggingEnabled();
    }

    /**
     * Lightweight error logging without stack traces for memory efficiency
     * @param message Error message
     * @param error Optional error object
     */
    public logError(message: string, error?: Error): void {
        if (!this.isLoggingEnabled()) return;

        if (error) {
            this.error(`${message}: ${error.message}`);
        } else {
            this.error(message);
        }
    }

    /**
     * Log user actions for debugging
     * @param action Action name
     * @param details Optional action details
     */
    public logUserAction(action: string, details?: string): void {
        if (!this.isLoggingEnabled()) return;

        let message = `USER ACTION: ${action}`;
        if (details) {
            message += ` - ${details}`;
        }

        this.debug(message);
    }

    /**
     * Log navigation events
     * @param from Previous route
     * @param to New route
     */
    public logNavigation(from: string, to: string): void {
        if (!this.isLoggingEnabled()) return;

        this.debug(`NAVIGATION: ${from} → ${to}`);
    }
}