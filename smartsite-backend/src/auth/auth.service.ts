import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserDocument } from '../users/users.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Calcul de la distance euclidienne entre 2 descripteurs faciaux (128D)
function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel('Role') private roleModel: Model<any>,
  ) {}

  // ── Login classique email + mot de passe ──────────────────────
  async login(email: string, password: string) {
    const user = await this.usersService['userModel'].findOne({ email });

    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  // ── Register ──────────────────────────────────────────────────
  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new this.usersService['userModel']({
      ...userData,
      password: hashedPassword,
    });
    return newUser.save();
  }

  // ── Face Login ────────────────────────────────────────────────
  //async faceLogin(email: string, incomingDescriptor: number[]) {
    // 1. Trouver l'utilisateur par email
   // const user = await this.usersService.findByEmail(email);
   // if (!user)
    //  throw new NotFoundException('Utilisateur non trouvé');

    // 2. Vérifier qu'un descripteur facial est enregistré
   // if (!user.faceDescriptor || user.faceDescriptor.length === 0)
    //  throw new BadRequestException('Aucun visage enregistré pour ce compte');

    // 3. Comparer les descripteurs (distance euclidienne)
   // const distance = euclideanDistance(
    //  Array.from(user.faceDescriptor),
    //  incomingDescriptor,
    //);

    // 4. Seuil 0.6 = standard face-api.js
   // if (distance > 0.6)
    //  throw new UnauthorizedException('Visage non reconnu');

    // 5. Générer le JWT
   // return this.generateToken(user);
  //}


  async faceLoginAuto(incomingDescriptor: number[]) {
  const users = await this.usersService.getAllUsersWithFace();

  if (!users || users.length === 0) {
    throw new NotFoundException('Aucun utilisateur avec Face ID');
  }

let bestMatch: UserDocument | null = null;  let bestDistance = Infinity;

  for (const user of users) {
    if (!user.faceDescriptor || user.faceDescriptor.length === 0) continue;

    const distance = euclideanDistance(
      Array.from(user.faceDescriptor),
      incomingDescriptor
    );

    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = user;
    }
  }

  // seuil standard face-api.js
  if (!bestMatch || bestDistance > 0.6) {
    throw new UnauthorizedException('Visage non reconnu');
  }

  return this.generateToken(bestMatch);
}
  // ── Méthode privée partagée : génère le JWT ───────────────────
  private async generateToken(user: any) {
        const role = await this.roleModel.findById(user.roleId);

    const payload = {
      sub:      user._id,
      email:    user.email,
      fullName: user.fullName,
      roleId:   user.roleId,
      roleName: role?.name || '',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}