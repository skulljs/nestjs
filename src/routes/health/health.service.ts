import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiskHealthIndicator, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: PrismaHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator
  ) {}

  check() {
    const OS = process.platform;
    const storagePath = OS === 'win32' ? this.configService.get('healthCheckStorageWindowsPath') : this.configService.get('healthCheckStorageLinuxPath');

    return this.health.check([
      () => this.db.pingCheck('database', this.prisma),
      () => this.disk.checkStorage('storage', { path: storagePath, thresholdPercent: this.configService.get('healthCheckStorageThresholdPercent') }),
      () => this.memory.checkHeap('memory_heap', this.configService.get('healthCheckMemoryHeapThreshold')),
      () => this.memory.checkRSS('memory_rss', this.configService.get('healthCheckMemoryRssThreshold')),
    ]);
  }
}
