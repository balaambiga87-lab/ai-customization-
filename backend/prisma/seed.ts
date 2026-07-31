import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('Cleaning database before seeding...');
  await prisma.auditLog.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.aIGeneratedPreview.deleteMany({});
  await prisma.promptHistory.deleteMany({});
  await prisma.aIRecommendation.deleteMany({});
  await prisma.designObject.deleteMany({});
  await prisma.savedDesign.deleteMany({});
  await prisma.blueprintAnchor.deleteMany({});
  await prisma.blueprint.deleteMany({});
  await prisma.jewelleryAsset.deleteMany({});
  await prisma.assetCategory.deleteMany({});
  await prisma.gemstone.deleteMany({});
  await prisma.material.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
}

async function main() {
  await cleanDatabase();

  console.log('Seeding initial data...');

  // 1. Seed Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@caratline.com',
      password: '$2b$10$Eixk9.S23wD4A9d5z9.m9.O59uVlqKz6n5e8oF.f5Kq.v1t7oAxeS', // bcrypt hashed password: 'password123'
      name: 'Caratline Admin',
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'sarah.jones@example.com',
      password: '$2b$10$Eixk9.S23wD4A9d5z9.m9.O59uVlqKz6n5e8oF.f5Kq.v1t7oAxeS', // password123
      name: 'Sarah Jones',
      role: Role.USER,
    },
  });

  console.log(`Created users: Admin (${admin.email}), Customer (${customer.email})`);

  // 2. Seed Categories
  const ringsCategory = await prisma.category.create({
    data: {
      name: 'Rings',
      slug: 'rings',
      description: 'Customizable premium wedding, engagement, and casual rings.',
    },
  });

  const necklacesCategory = await prisma.category.create({
    data: {
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Elegant custom pendant necklaces and chokers.',
    },
  });

  console.log('Created product categories.');

  // 3. Seed Products
  const solitaireRingProduct = await prisma.product.create({
    data: {
      categoryId: ringsCategory.id,
      name: 'Classic Solitaire Ring Setting',
      slug: 'classic-solitaire-ring',
      sku: 'PRD-RNG-SLT-01',
      description: 'A timeless ring setting featuring a slender band and elevated prong mount designed to maximize gem fire.',
      basePrice: 450.00,
      isCustomizable: true,
      isActive: true,
    },
  });

  console.log(`Created product: ${solitaireRingProduct.name}`);

  // 4. Seed Product Images
  await prisma.productImage.create({
    data: {
      productId: solitaireRingProduct.id,
      url: '/assets/products/solitaire-base.jpg',
      altText: 'Classic Solitaire Ring base model setting',
      isPrimary: true,
      sortOrder: 0,
    },
  });

  // 5. Seed Materials
  const yellowGold18k = await prisma.material.create({
    data: {
      name: '18K Yellow Gold',
      sku: 'MAT-GLD-18Y',
      materialType: 'gold',
      purity: '18k',
      pricePerGram: 65.50,
      density: 15.58, // g/cm³
      isActive: true,
    },
  });

  const platinum950 = await prisma.material.create({
    data: {
      name: 'Platinum 950',
      sku: 'MAT-PLT-950',
      materialType: 'platinum',
      purity: '950',
      pricePerGram: 42.00,
      density: 21.45, // g/cm³
      isActive: true,
    },
  });

  console.log('Created base materials.');

  // 6. Seed Gemstones
  const diamond1ct = await prisma.gemstone.create({
    data: {
      name: '1.00 Carat Round Brilliant Diamond',
      sku: 'GEM-DIA-RND-100',
      type: 'diamond',
      shape: 'round',
      carat: 1.00,
      color: 'G',
      clarity: 'VS1',
      cut: 'Excellent',
      price: 5200.00,
      isActive: true,
    },
  });

  const emerald2ct = await prisma.gemstone.create({
    data: {
      name: '2.00 Carat Oval Zambian Emerald',
      sku: 'GEM-EMR-OVL-200',
      type: 'emerald',
      shape: 'oval',
      carat: 2.00,
      color: 'Vibrant Green',
      clarity: 'VVS2',
      cut: 'Very Good',
      price: 3400.00,
      isActive: true,
    },
  });

  console.log('Created stones.');

  // 7. Seed Asset Categories
  const shankCategory = await prisma.assetCategory.create({
    data: {
      name: 'Ring Shanks (Bands)',
      code: 'SHANK',
      description: 'The band part of the ring structure.',
    },
  });

  const settingCategory = await prisma.assetCategory.create({
    data: {
      name: 'Ring Settings (Heads)',
      code: 'HEAD',
      description: 'The prong assembly mounting the gemstone.',
    },
  });

  console.log('Created asset categories.');

  // 8. Seed Jewellery Assets
  const knifeEdgeShank = await prisma.jewelleryAsset.create({
    data: {
      assetCategoryId: shankCategory.id,
      name: 'Knife-Edge Band Shape',
      sku: 'AST-SHK-KNF-01',
      modelUrl: '/assets/models/shanks/knife_edge_band.glb',
      thumbnailUrl: '/assets/thumbnails/shanks/knife_edge.png',
      metaData: { weightCm3: 0.12 }, // Used to compute weight based on metal density
      priceModifier: 50.00,
    },
  });

  const prong6Head = await prisma.jewelleryAsset.create({
    data: {
      assetCategoryId: settingCategory.id,
      name: '6-Prong Setting Head',
      sku: 'AST-HED-6PRG-01',
      modelUrl: '/assets/models/heads/prong_6_head.glb',
      thumbnailUrl: '/assets/thumbnails/heads/prong_6.png',
      metaData: { compatibleShapes: ['round'] },
      priceModifier: 75.00,
    },
  });

  console.log('Created jewellery assets.');

  // 9. Seed Blueprint
  const solitaireBlueprint = await prisma.blueprint.create({
    data: {
      productId: solitaireRingProduct.id,
      name: 'Customizable Solitaire Ring Setting',
      modelUrl: '/assets/models/blueprints/solitaire_ring_skeleton.glb',
      thumbnailUrl: '/assets/products/solitaire-base.jpg',
      basePrice: solitaireRingProduct.basePrice,
      metadata: {
        sizing: {
          minSize: 4,
          maxSize: 13,
          defaultSize: 7,
        },
      },
    },
  });

  console.log(`Created blueprint: ${solitaireBlueprint.name}`);

  // 10. Seed Blueprint Anchors
  await prisma.blueprintAnchor.create({
    data: {
      blueprintId: solitaireBlueprint.id,
      name: 'center_gem_anchor',
      anchorType: 'GEM_SLOT',
      positionX: 0.0,
      positionY: 1.25,
      positionZ: 0.0,
      allowedAssetCategoryIds: [settingCategory.id],
    },
  });

  await prisma.blueprintAnchor.create({
    data: {
      blueprintId: solitaireBlueprint.id,
      name: 'ring_band_anchor',
      anchorType: 'BAND_PART',
      positionX: 0.0,
      positionY: 0.0,
      positionZ: 0.0,
      allowedAssetCategoryIds: [shankCategory.id],
    },
  });

  await prisma.blueprintAnchor.create({
    data: {
      blueprintId: solitaireBlueprint.id,
      name: 'inside_band_engraving',
      anchorType: 'ENGRAVING',
      positionX: 0.0,
      positionY: -0.85,
      positionZ: 0.0,
      allowedAssetCategoryIds: [],
    },
  });

  console.log('Created blueprint anchors.');

  // 11. Seed a sample Customer Saved Design
  const customSavedDesign = await prisma.savedDesign.create({
    data: {
      userId: customer.id,
      blueprintId: solitaireBlueprint.id,
      name: 'Engagement Ring - 1ct Diamond',
      configuration: {
        size: 6.5,
        engravingText: 'Forever Yours S&J',
        components: {
          ring_band_anchor: knifeEdgeShank.id,
          center_gem_anchor: prong6Head.id,
        },
        metals: {
          band: yellowGold18k.id,
        },
        gems: {
          center: diamond1ct.id,
        },
      },
      totalPrice: 5825.00, // 450 (base) + 50 (band shank) + 75 (prong head) + 5200 (diamond) + Gold material factor
      isPublic: false,
    },
  });

  // 12. Create Design Objects
  await prisma.designObject.create({
    data: {
      savedDesignId: customSavedDesign.id,
      blueprintAnchorId: (await prisma.blueprintAnchor.findFirst({ where: { name: 'ring_band_anchor' } }))!.id,
      jewelleryAssetId: knifeEdgeShank.id,
      materialId: yellowGold18k.id,
      priceCalculated: 115.50, // includes metal cost estimation
    },
  });

  await prisma.designObject.create({
    data: {
      savedDesignId: customSavedDesign.id,
      blueprintAnchorId: (await prisma.blueprintAnchor.findFirst({ where: { name: 'center_gem_anchor' } }))!.id,
      jewelleryAssetId: prong6Head.id,
      gemstoneId: diamond1ct.id,
      priceCalculated: 5275.00, // includes head and diamond cost
    },
  });

  console.log(`Created sample SavedDesign: ${customSavedDesign.name}`);

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
