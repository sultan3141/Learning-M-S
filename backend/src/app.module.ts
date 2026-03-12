import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { LiveSessionsModule } from './live-sessions/live-sessions.module';
import { RecordingsModule } from './recordings/recordings.module';
import { AdminModule } from './admin/admin.module';
import { LiveKitModule } from './livekit/livekit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    CoursesModule,
    LiveSessionsModule,
    RecordingsModule,
    AdminModule,
    LiveKitModule,
  ],
})
export class AppModule { }
