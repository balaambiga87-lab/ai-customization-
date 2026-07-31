import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { AssetsModule } from './modules/assets/assets.module';
import { CustomizationModule } from './modules/customization/customization.module';
import { DesignsModule } from './modules/designs/designs.module';
import { BlueprintsModule } from './modules/blueprints/blueprints.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AiModule } from './modules/ai/ai.module';
import { PricingModule } from './modules/pricing/pricing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    AssetsModule,
    CustomizationModule,
    DesignsModule,
    BlueprintsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    AiModule,
    PricingModule,
  ],
})
export class AppModule {}
