import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profiles.entity';
import { UsersModule } from 'src/users/users.module';
import { FavoritesUsersModule } from 'src/favorites_users/favorites_users.module';
import { ExtraDocumentsModule } from 'src/extra_documents/extra_documents.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    UsersModule,
    FavoritesUsersModule,
    ExtraDocumentsModule,
    FilesModule,
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
