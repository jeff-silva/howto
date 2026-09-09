export interface IBrowserService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  navigateTo(url: string): Promise<void>;
  getTitle(): Promise<string>;
}
