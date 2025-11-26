import { FetchAndAggregateNewsUseCase } from '@/application/use-cases/FetchAndAggregateNewsUseCase';
import { config } from '@/infrastructure/config/config';
import { logger } from '@/infrastructure/logger/PinoLogger';
import { LOG_EVENTS } from '@/infrastructure/logger/LOG_EVENTS';

export class JobScheduler {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private readonly fetchAndAggregateUseCase: FetchAndAggregateNewsUseCase) {}

  start(): void {
    if (this.intervalId) {
      logger.info({
        event: LOG_EVENTS.SCHEDULER_STARTED,
        msg: 'Scheduler is already running',
      });
      return;
    }

    logger.info({
      event: LOG_EVENTS.SCHEDULER_STARTED,
      msg: 'Starting scheduler',
      data: {
        intervalMs: config.newsRefreshIntervalMs,
      },
    });

    // Ejecutar inmediatamente al iniciar
    this.executeJob();

    // Programar ejecuciones periódicas
    this.intervalId = setInterval(() => {
      this.executeJob();
    }, config.newsRefreshIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info({
        event: LOG_EVENTS.SCHEDULER_STOPPED,
        msg: 'Scheduler stopped',
      });
    }
  }

  private async executeJob(): Promise<void> {
    try {
      logger.info({
        event: LOG_EVENTS.SCHEDULER_JOB_EXECUTED,
        msg: 'Executing scheduled news fetch job',
      });
      await this.fetchAndAggregateUseCase.execute();
    } catch (error) {
      logger.error({
        event: LOG_EVENTS.SCHEDULER_JOB_ERROR,
        msg: 'Error in scheduled job',
        err: error,
      });
    }
  }
}

