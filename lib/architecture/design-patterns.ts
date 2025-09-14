/**
 * Advanced Design Patterns Implementation
 * Singleton, Factory, Observer, Repository, Strategy patterns
 */

// =============================================================================
// SINGLETON PATTERN - Configuration Manager
// =============================================================================
export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: Map<string, any> = new Map();

  private constructor() {
    this.loadDefaultConfig();
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  private loadDefaultConfig(): void {
    this.config.set('theme', 'light');
    this.config.set('language', 'en');
    this.config.set('apiTimeout', 10000);
    this.config.set('retryAttempts', 3);
    this.config.set('cacheSize', 100);
  }

  public get<T>(key: string, defaultValue?: T): T {
    return this.config.get(key) ?? defaultValue;
  }

  public set(key: string, value: any): void {
    this.config.set(key, value);
    this.notifyObservers(key, value);
  }

  public getAll(): Record<string, any> {
    return Object.fromEntries(this.config);
  }

  // Observer pattern integration
  private observers: Array<(key: string, value: any) => void> = [];

  public subscribe(observer: (key: string, value: any) => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(key: string, value: any): void {
    this.observers.forEach(observer => observer(key, value));
  }
}

// =============================================================================
// FACTORY PATTERN - Service Factory
// =============================================================================
export interface IService {
  name: string;
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}

export class ApiService implements IService {
  name = 'ApiService';
  
  async initialize(): Promise<void> {
    // Empty block
  }
  
  async destroy(): Promise<void> {
    // Empty block
  }
}

export class CacheService implements IService {
  name = 'CacheService';
  
  async initialize(): Promise<void> {
    // Empty block
  }
  
  async destroy(): Promise<void> {
    // Empty block
  }
}

export class LoggingService implements IService {
  name = 'LoggingService';
  
  async initialize(): Promise<void> {
    // Empty block
  }
  
  async destroy(): Promise<void> {
    // Empty block
  }
}

export class ServiceFactory {
  private static services: Map<string, () => IService> = new Map([
    ['api', () => new ApiService()],
    ['cache', () => new CacheService()],
    ['logging', () => new LoggingService()],
  ]);

  public static createService(type: string): IService {
    const serviceCreator = this.services.get(type);
    if (!serviceCreator) {
      throw new Error(`Service type "${type}" not found`);
    }
    return serviceCreator();
  }

  public static registerService(type: string, creator: () => IService): void {
    this.services.set(type, creator);
  }

  public static getAvailableServices(): string[] {
    return Array.from(this.services.keys());
  }
}

// =============================================================================
// OBSERVER PATTERN - Event System
// =============================================================================
export interface IObserver<T = any> {
  update(data: T): void;
}

export interface ISubject<T = any> {
  subscribe(observer: IObserver<T>): () => void;
  unsubscribe(observer: IObserver<T>): void;
  notify(data: T): void;
}

export class EventSubject<T = any> implements ISubject<T> {
  private observers: Set<IObserver<T>> = new Set();

  public subscribe(observer: IObserver<T>): () => void {
    this.observers.add(observer);
    return () => this.unsubscribe(observer);
  }

  public unsubscribe(observer: IObserver<T>): void {
    this.observers.delete(observer);
  }

  public notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }

  public getObserverCount(): number {
    return this.observers.size;
  }
}

// =============================================================================
// REPOSITORY PATTERN - Data Access Layer
// =============================================================================
export interface IRepository<T, K = string> {
  findById(id: K): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: K, entity: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
  findBy(criteria: Partial<T>): Promise<T[]>;
}

export abstract class BaseRepository<T extends { id: string }> implements IRepository<T> {
  protected abstract entityName: string;
  protected cache: Map<string, T> = new Map();
  protected cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  public async findById(id: string): Promise<T | null> {
    // Check cache first
    const cached = this.getCachedEntity(id);
    if (cached) return cached;

    // Fetch from data source
    const entity = await this.fetchFromDataSource(id);
    if (entity) {
      this.setCachedEntity(entity);
    }
    
    return entity;
  }

  public async findAll(): Promise<T[]> {
    return this.fetchAllFromDataSource();
  }

  public async create(entity: Omit<T, 'id'>): Promise<T> {
    const newEntity = await this.createInDataSource(entity);
    this.setCachedEntity(newEntity);
    return newEntity;
  }

  public async update(id: string, entity: Partial<T>): Promise<T> {
    const updatedEntity = await this.updateInDataSource(id, entity);
    this.setCachedEntity(updatedEntity);
    return updatedEntity;
  }

  public async delete(id: string): Promise<boolean> {
    const success = await this.deleteFromDataSource(id);
    if (success) {
      this.cache.delete(id);
      this.cacheExpiry.delete(id);
    }
    return success;
  }

  public async findBy(criteria: Partial<T>): Promise<T[]> {
    return this.findByCriteriaInDataSource(criteria);
  }

  // Abstract methods to be implemented by concrete repositories
  protected abstract fetchFromDataSource(id: string): Promise<T | null>;
  protected abstract fetchAllFromDataSource(): Promise<T[]>;
  protected abstract createInDataSource(entity: Omit<T, 'id'>): Promise<T>;
  protected abstract updateInDataSource(id: string, entity: Partial<T>): Promise<T>;
  protected abstract deleteFromDataSource(id: string): Promise<boolean>;
  protected abstract findByCriteriaInDataSource(criteria: Partial<T>): Promise<T[]>;

  // Cache management
  private getCachedEntity(id: string): T | null {
    const expiry = this.cacheExpiry.get(id);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(id);
      this.cacheExpiry.delete(id);
      return null;
    }
    return this.cache.get(id) || null;
  }

  private setCachedEntity(entity: T): void {
    this.cache.set(entity.id, entity);
    this.cacheExpiry.set(entity.id, Date.now() + this.CACHE_TTL);
  }
}

// =============================================================================
// STRATEGY PATTERN - Algorithm Selection
// =============================================================================
export interface IValidationStrategy {
  validate(data: any): { valid: boolean; errors: string[] };
}

export class EmailValidationStrategy implements IValidationStrategy {
  validate(email: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    
    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
    
    return { valid: errors.length === 0, errors };
  }
}

export class PasswordValidationStrategy implements IValidationStrategy {
  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }
    }
    
    return { valid: errors.length === 0, errors };
  }
}

export class ValidationContext {
  private strategy: IValidationStrategy;

  constructor(strategy: IValidationStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: IValidationStrategy): void {
    this.strategy = strategy;
  }

  public validate(data: any): { valid: boolean; errors: string[] } {
    return this.strategy.validate(data);
  }
}

// =============================================================================
// COMMAND PATTERN - Action Management
// =============================================================================
export interface ICommand {
  execute(): Promise<any>;
  undo(): Promise<any>;
  canUndo(): boolean;
}

export class CreateUserCommand implements ICommand {
  constructor(
    private userData: any,
    private userRepository: IRepository<any>
  ) {
    // Empty block
  }

  async execute(): Promise<any> {
    return this.userRepository.create(this.userData);
  }

  async undo(): Promise<any> {
    // Implementation would delete the created user
    return Promise.resolve();
  }

  canUndo(): boolean {
    return true;
  }
}

export class CommandInvoker {
  private history: ICommand[] = [];
  private currentIndex = -1;

  async executeCommand(command: ICommand): Promise<any> {
    const result = await command.execute();
    
    // Remove any commands after current index
    this.history.splice(this.currentIndex + 1);
    
    // Add new command
    this.history.push(command);
    this.currentIndex++;
    
    return result;
  }

  async undo(): Promise<any> {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex];
      if (command.canUndo()) {
        const result = await command.undo();
        this.currentIndex--;
        return result;
      }
    }
    throw new Error('Cannot undo');
  }

  async redo(): Promise<any> {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      return command.execute();
    }
    throw new Error('Cannot redo');
  }

  canUndo(): boolean {
    return this.currentIndex >= 0 && 
           this.history[this.currentIndex]?.canUndo();
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}

// =============================================================================
// FACADE PATTERN - Simplified Interface
// =============================================================================
export class ApplicationFacade {
  private configManager: ConfigurationManager;
  private commandInvoker: CommandInvoker;
  private eventSystem: EventSubject;

  constructor() {
    this.configManager = ConfigurationManager.getInstance();
    this.commandInvoker = new CommandInvoker();
    this.eventSystem = new EventSubject();
  }

  // Simplified configuration access
  public getConfig<T>(key: string, defaultValue?: T): T {
    return this.configManager.get(key, defaultValue);
  }

  public setConfig(key: string, value: any): void {
    this.configManager.set(key, value);
  }

  // Simplified service creation
  public createService(type: string): IService {
    return ServiceFactory.createService(type);
  }

  // Simplified command execution
  public async executeCommand(command: ICommand): Promise<any> {
    return this.commandInvoker.executeCommand(command);
  }

  public async undoLastCommand(): Promise<any> {
    return this.commandInvoker.undo();
  }

  // Simplified event handling
  public subscribeToEvents<T>(observer: IObserver<T>): () => void {
    return this.eventSystem.subscribe(observer);
  }

  public publishEvent<T>(data: T): void {
    this.eventSystem.notify(data);
  }
}

// Export singleton instance
export const ApplicationCore = new ApplicationFacade();