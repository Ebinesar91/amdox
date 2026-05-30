import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaService } from './common/prisma.service';
import { TenantMiddleware } from './common/tenant.context';
import { FinanceController } from './modules/finance/finance.controller';
import { HRController } from './modules/hr/hr.controller';
import { SCMController } from './modules/supply-chain/scm.controller';
import { ProjectsController } from './modules/projects/projects.controller';
import { BIController } from './modules/bi/bi.controller';

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
  ],
  controllers: [
    FinanceController,
    HRController,
    SCMController,
    ProjectsController,
    BIController,
  ],
  providers: [
    PrismaService,
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
