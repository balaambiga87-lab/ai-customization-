import { BadRequestException } from '@nestjs/common';
import { StructuredDesign } from '../types/interpreter.types';

export class DesignCompatValidator {
  private static SUPPORTED_PRODUCT_TYPES = ['ring', 'necklace', 'earrings', 'pendant', 'bracelet'];

  /**
   * Performs schema structure and static configuration constraints check.
   */
  static validate(design: StructuredDesign): void {
    if (!design.productType) {
      throw new BadRequestException('Invalid design schema: productType is missing.');
    }

    const typeLower = design.productType.toLowerCase();
    if (!this.SUPPORTED_PRODUCT_TYPES.includes(typeLower)) {
      throw new BadRequestException(
        `Unsupported jewellery type "${design.productType}". Allowed catalog types are: ${this.SUPPORTED_PRODUCT_TYPES.join(', ')}`
      );
    }

    if (!design.metal || !design.metal.type) {
      throw new BadRequestException('Invalid design schema: metal.type configuration is required.');
    }

    // Check specific shape limits
    if (typeLower === 'ring' && design.centerStone) {
      const shape = design.centerStone.shape?.toLowerCase();
      const allowedRingShapes = ['round', 'oval', 'pear', 'emerald', 'cushion', 'heart', 'marquise'];
      if (shape && !allowedRingShapes.includes(shape)) {
        throw new BadRequestException(
          `Shape "${design.centerStone.shape}" is not compatible with ring settings.`
        );
      }
    }
  }
}
