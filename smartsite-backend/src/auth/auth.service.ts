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
    @InjectModel('Role') private roleModel: Model<any>, // ✅ injection du modèle Role
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

  // ── Face Login Auto ───────────────────────────────────────────
  async faceLoginAuto(incomingDescriptor: number[]) {
    const users = await this.usersService.getAllUsersWithFace();

    if (!users || users.length === 0) {
      throw new NotFoundException('Aucun utilisateur avec Face ID');
    }

    let bestMatch: UserDocument | null = null;
    let bestDistance = Infinity;

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
    // ✅ Récupérer le nom du rôle depuis la base
    const role = await this.roleModel.findById(user.roleId);

    const payload = {
      sub:      user._id,
      email:    user.email,
      fullName: user.fullName,
      roleId:   user.roleId,
      roleName: role?.name || '', // ✅ nom du rôle dans le token
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}