import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class InterpretDesignDto {
  @IsString()
  @IsNotEmpty({ message: 'The natural language design prompt is required.' })
  prompt!: string;
}

export class RegeneratePreviewDto {
  @IsUUID('4', { message: 'Invalid prompt history ID.' })
  @IsNotEmpty({ message: 'Prompt history ID is required to regenerate.' })
  promptHistoryId!: string;
}

export class AcceptPreviewDto {
  @IsUUID('4', { message: 'Invalid preview ID format.' })
  @IsNotEmpty({ message: 'Preview ID is required to accept.' })
  previewId!: string;
}
