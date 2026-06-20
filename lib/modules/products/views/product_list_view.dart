import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../../app/routes/app_routes.dart';
import '../../../core/constants/color_constants.dart';
import '../../../core/utils/helpers.dart';
import '../../../core/widgets/empty_state_widget.dart';
import '../../../core/widgets/error_state_widget.dart';
import '../../../core/widgets/skeleton_loader.dart';
import '../controller.dart';

class ProductListView extends GetView<ProductController> {
  const ProductListView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Products'.tr),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: TextField(
              controller: controller.searchController,
              onSubmitted: controller.searchProducts,
              decoration: InputDecoration(
                hintText: 'Search products...'.tr,
                prefixIcon: const Icon(Icons.search, size: 22),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear, size: 20),
                  onPressed: () {
                    controller.searchController.clear();
                    controller.loadProducts(refresh: true);
                  },
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
        ),
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2, childAspectRatio: 0.75,
              crossAxisSpacing: 12, mainAxisSpacing: 12,
            ),
            itemCount: 6,
            itemBuilder: (_, __) => const CardSkeletonLoader(),
          );
        }
        if (controller.isError.value) {
          return ErrorStateWidget(
            message: controller.errorMessage.value,
            onRetry: () => controller.loadProducts(refresh: true),
          );
        }
        if (controller.products.isEmpty) {
          return EmptyStateWidget(
            icon: Icons.inventory_2_outlined,
            title: 'No products found'.tr,
            subtitle: 'Try a different search term'.tr,
          );
        }

        return NotificationListener<ScrollNotification>(
          onNotification: (notification) {
            if (notification.metrics.pixels >= notification.metrics.maxScrollExtent - 200) {
              controller.loadMore();
            }
            return false;
          },
          child: RefreshIndicator(
            onRefresh: () => controller.loadProducts(refresh: true),
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, childAspectRatio: 0.7,
                crossAxisSpacing: 12, mainAxisSpacing: 12,
              ),
              itemCount: controller.products.length,
              itemBuilder: (context, index) {
                final product = controller.products[index];
                return GestureDetector(
                  onTap: () => Get.toNamed(AppRoutes.productDetail, arguments: product.id),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Theme.of(context).dividerColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          flex: 3,
                          child: Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.05),
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                            ),
                            child: product.primaryImageUrl.isNotEmpty
                                ? ClipRRect(
                                    borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                                    child: Image.network(
                                      Helpers.buildImageUrl(product.primaryImageUrl),
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) =>
                                          const Center(child: Icon(Icons.inventory_2, size: 40, color: AppColors.primary)),
                                    ),
                                  )
                                : const Center(child: Icon(Icons.inventory_2, size: 40, color: AppColors.primary)),
                          ),
                        ),
                        Expanded(
                          flex: 2,
                          child: Padding(
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(product.name, maxLines: 2, overflow: TextOverflow.ellipsis,
                                  style: Theme.of(context).textTheme.titleSmall),
                                const Spacer(),
                                Row(
                                  children: [
                                    const Icon(Icons.star, color: AppColors.coinGold, size: 14),
                                    const SizedBox(width: 4),
                                    Text('${product.averageRating}',
                                      style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600)),
                                    Text(' (${product.totalReviews})',
                                      style: Theme.of(context).textTheme.bodySmall),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ).animate().fadeIn(delay: Duration(milliseconds: 50 * index)).slideY(begin: 0.05),
                );
              },
            ),
          ),
        );
      }),
    );
  }
}
