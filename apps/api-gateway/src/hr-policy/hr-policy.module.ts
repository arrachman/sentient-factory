import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrPolicyController } from './hr-policy.controller';
import { HrPolicyService } from './hr-policy.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrPolicyController],
  providers: [HrPolicyService],
})
export class HrPolicyModule {}
