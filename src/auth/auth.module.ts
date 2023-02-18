import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accToken.strategy';
import { RefreshTokenStrategy } from './strategies/refToken.strategy';
import { constantsJWT } from './jwt-secret';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtModule.register({
    secret: constantsJWT[0],
      signOptions: { expiresIn: '60s' }}) , UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
