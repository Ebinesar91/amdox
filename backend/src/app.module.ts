import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaService } from './common/prisma.service';
import { TenantMiddleware } from './common/tenant.context';
import { FinanceController } from './modules/finance/finance.controller';
import { HRController } from './modules/hr/hr.controller';
import { SCMController } from './modules/supply-chain/scm.controller';
import { ProjectsController } from './modules/projects/projects.controller';
import { BIController } from './modules/bi/bi.controller';
import { NotificationsController } from './modules/notifications/notifications.controller';
import { HealthController } from './common/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';
import { AuditInterceptor } from './common/audit.interceptor';
import { RateLimiterGuard } from './common/rate-limiter.guard';

@Module({
  imports: [
    // Load config variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configure GraphQL Apollo Driver
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),

    // Native Auth & Cache modules
    AuthModule,
    RedisModule,
  ],
  controllers: [
    FinanceController,
    HRController,
    SCMController,
    ProjectsController,
    BIController,
    NotificationsController,
    HealthController,
  ],
  providers: [
    PrismaService,
    // Enable global rate limiting
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
    // Enable global write-action audit interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [
    PrismaService,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Inject multi-tenant context across all HTTP requests
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}
