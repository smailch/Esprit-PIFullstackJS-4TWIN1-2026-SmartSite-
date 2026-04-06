import { Controller, Post, Body, Get, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {

 constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,  // ← cette ligne manque
  ) {}
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
  @UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  // req.user contient le payload du JWT décodé par la stratégie
  return req.user; 
}

// Connexion par visage (publique)
//@Post('face-login')
//async faceLogin(
  //@Body('email') email: string,
  //@Body('descriptor') descriptor: number[],
//) {
//  return this.authService.faceLogin(email, descriptor);
//}

@Post('face-login-auto')
async faceLoginAuto(@Body('descriptor') descriptor: number[]) {
  return this.authService.faceLoginAuto(descriptor);
}

@UseGuards(JwtAuthGuard) // 👈 AJOUTE ÇA
@Post('face-register')
async faceRegister(@Request() req, @Body('descriptor') descriptor: number[]) {
  console.log('req.user:', req.user);

  if (!req.user) {
    throw new UnauthorizedException('User not authenticated');
  }

  await this.usersService.saveFaceDescriptor(req.user.sub, descriptor);

  return { message: 'FACE_REGISTERED' };
}


}