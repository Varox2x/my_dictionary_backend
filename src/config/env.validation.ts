import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum NodeEnvironment {
  Production = 'production',
  Development = 'development',
  Staging = 'staging',
}

class EnvironmentVariables {
  @IsNotEmpty()
  @IsNumber()
  APP_PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DB_USER: string;

  @IsNotEmpty()
  @IsString()
  DB_NAME: string;

  @IsNotEmpty()
  @IsNumber()
  DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_HOST: string;

  @IsNotEmpty()
  @IsBoolean()
  DB_LOGGING: boolean;

  @IsNotEmpty()
  @IsString()
  APP_URL: string;

  @IsNotEmpty()
  @IsString()
  AUTH_SECRET: string;

  @IsNotEmpty()
  @IsString()
  AT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  RT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  NODE_ENV: NodeEnvironment;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
