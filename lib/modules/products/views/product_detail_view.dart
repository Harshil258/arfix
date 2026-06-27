import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../../core/constants/color_constants.dart';
import '../../../core/utils/helpers.dart';
import '../../../core/widgets/skeleton_loader.dart';
import '../controller.dart';

class ProductDetailView extends GetView<ProductController> {
  const ProductDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    final productId = Get.arguments as String?;
    if (productId != null && controller.selectedProduct.value?.id != productId) {
      controller.loadProductDetail(productId);
    }
    return Scaffold(
      appBar: AppBar(title: Text('Product Details'.tr)),
      body: Obx(() {
        if (controller.isLoadingDetail.value) {
          return const Padding(
            padding: EdgeInsets.all(20),
            child: Column(children: [
              SkeletonLoader(height: 250, borderRadius: 20),
              SizedBox(height: 20),
              SkeletonLoader(height: 24, width: 200),
              SizedBox(height: 12),
              SkeletonLoader(height: 16),
              SizedBox(height: 8),
              SkeletonLoader(height: 16),
            ]),
          );
        }

        final product = controller.selectedProduct.value;
        if (product == null) {
          return Center(child: Text('Product not found'.tr));
        }

        return SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image
              Container(
                height: 380, width: double.infinity,
                padding: const EdgeInsets.all(16),
                color: AppColors.primary.withValues(alpha: 0.05),
                child: product.primaryImageUrl.isNotEmpty
                    ? Image.network(
                        Helpers.buildImageUrl(product.primaryImageUrl),
                        fit: BoxFit.contain,
                        errorBuilder: (_, __, ___) =>
                            const Center(child: Icon(Icons.inventory_2, size: 64, color: AppColors.primary)),
                      )
                    : const Center(child: Icon(Icons.inventory_2, size: 64, color: AppColors.primary)),
              ).animate().fadeIn(duration: 400.ms),

              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product.name, style: Theme.of(context).textTheme.displaySmall)
                        .animate().fadeIn(delay: 100.ms).slideX(begin: -0.05),
                    const SizedBox(height: 12),
                    // Rating
                    Row(
                      children: [
                        ...List.generate(5, (i) => Icon(
                          i < product.averageRating.round() ? Icons.star : Icons.star_border,
                          color: AppColors.coinGold, size: 20,
                        )),
                        const SizedBox(width: 8),
                        Text('${product.averageRating} (${product.totalReviews} ${'reviews'.tr})',
                          style: Theme.of(context).textTheme.bodyMedium),
                      ],
                    ).animate().fadeIn(delay: 200.ms),
                    const SizedBox(height: 24),
                    Text('Description'.tr, style: Theme.of(context).textTheme.headlineSmall),
                    const SizedBox(height: 8),
                    Text(product.description,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.6)),
                    const SizedBox(height: 24),
                    if (product.createdAt != null) ...[
                      Text('${'Added'.tr}: ${Helpers.formatDate(product.createdAt!)}',
                        style: Theme.of(context).textTheme.bodySmall),
                    ],
                  ],
                ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.05),
              ),
            ],
          ),
        );
      }),
    );
  }
}
