import { ApiService } from '.';
import { IRequestArguments } from '@/lib/interfaces';

export class ReportService {
  protected path = '/reports';

  /**
   * Cached instance of the service
   */
  private static instance: ReportService | null = null;

  /**
   * Service for making requests to the API
   */
  private readonly apiService: ApiService = ApiService.getInstance();

  /**
   * Constructor
   */
  private constructor() {
    if (ReportService.instance) {
      throw Error('Use `getInstance` instead of constructor');
    }
  }

  /**
   * Get an instance of the UserService
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new ReportService();
      return this.instance;
    }
    return this.instance;
  }

  public get api() {
    return {
      rushSummary: async (args: IRequestArguments) => {
        const { data: { data }} = await this.apiService.get(`${this.path}/rush_summary`, args);
        return data;
      },
      eocPpeSupply: async (args: IRequestArguments) => {
        const { data: { data }} = await this.apiService.get(`${this.path}/eoc_ppe_supply`, args);
        return data;
      },
      ppeSupply: async (args: IRequestArguments) => {
        const { data: { data }} = await this.apiService.get(`${this.path}/ppe_supply`, args);
        return data;
      },
      distChannelPpeSupply:async (args: IRequestArguments) => {
        const { data: { data }} = await this.apiService.get(`${this.path}/dist_channel_ppe_supply`, args);
        return data;
      },
    };
  }
}

