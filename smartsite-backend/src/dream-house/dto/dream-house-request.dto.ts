import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class DreamHouseRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  description!: string;

  /** Couleur d’accent façade / menuiseries (image + maillage Tripo). */
  @IsString()
  @IsNotEmpty()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'accentColor doit être un hexadécimal #RRGGBB (ex. #ea580c).',
  })
  accentColor!: string;
}
