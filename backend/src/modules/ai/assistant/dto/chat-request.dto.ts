import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ChatRequestDto {
  @IsNotEmpty({ message: 'Message content is required.' })
  @IsString({ message: 'Message must be a string.' })
  message!: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
