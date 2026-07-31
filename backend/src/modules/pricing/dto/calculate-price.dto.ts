import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CalculatePriceDto {
  @IsString()
  @IsNotEmpty({ message: 'Blueprint ID is required to calculate pricing.' })
  blueprintId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Primary metal material ID is required.' })
  selectedMetalId!: string;

  @IsString()
  @IsOptional()
  selectedGemstoneId?: string;

  @IsObject()
  @IsOptional()
  configuration?: Record<string, any>;

  @IsString()
  @IsOptional()
  currency?: string;
}
