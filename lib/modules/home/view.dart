import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import '../../app/routes/app_routes.dart';
import '../../core/constants/color_constants.dart';
import '../../core/utils/helpers.dart';
import '../../core/widgets/app_logo.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../core/widgets/skeleton_loader.dart';
import '../navigation/controller.dart' as nav;
import '../wallet/controller.dart';
import 'controller.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Obx(() {
        if (controller.isLoading.value) return _buildLoadingState();
        if (controller.isError.value) {
          return ErrorStateWidget(
            message: controller.errorMessage.value,
            onRetry: controller.loadData,
          );
        }
        return RefreshIndicator(
          onRefresh: controller.refreshUser,
          child: CustomScrollView(
            slivers: [
              // App bar
              SliverAppBar(
                floating: true, pinned: false,
                backgroundColor: Theme.of(context).scaffoldBackgroundColor,
                title: Row(
                  children: [
                    const AppLogo(size: 40, showBackground: true),
                    const SizedBox(width: 12),
                    Text('ARFIX', style: Theme.of(context).textTheme.headlineMedium),
                  ],
                ),
              ),
              // Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 8),

                      // Banners carousel
                      if (controller.banners.isNotEmpty) ...[
                        _buildBannerCarousel(context)
                            .animate().fadeIn(duration: 400.ms).slideY(begin: 0.1),
                        const SizedBox(height: 24),
                      ],

                      // Greeting
                      Text(
                        'Welcome back,'.tr,
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Theme.of(context).textTheme.bodySmall?.color,
                        ),
                      ).animate().fadeIn(duration: 400.ms),
                      Text(
                        controller.user.value?.name ?? 'User',
                        style: Theme.of(context).textTheme.displaySmall,
                      ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.05),
                      const SizedBox(height: 24),

                      // Coin Balance Card
                      _buildBalanceCard(context)
                          .animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
                      const SizedBox(height: 24),

                      // Active Campaign
                      if (controller.campaigns.isNotEmpty) ...[
                        _buildActiveCampaign(context)
                            .animate().fadeIn(delay: 250.ms).slideY(begin: 0.1),
                        const SizedBox(height: 24),
                      ],

                      // Quick Actions
                      _buildQuickActions(context)
                          .animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),
                      const SizedBox(height: 28),

                      // Recent Scans
                      _buildSectionHeader(context, 'Recent Scans'.tr, () => Get.toNamed(AppRoutes.scanHistory)),
                      const SizedBox(height: 12),
                      _buildRecentScans(context)
                          .animate().fadeIn(delay: 400.ms),
                      const SizedBox(height: 28),

                      // Featured Products
                      _buildSectionHeader(context, 'Featured Products'.tr, () {
                        final navCtrl = Get.find<nav.NavigationController>();
                        navCtrl.changePage(3);
                      }),
                      const SizedBox(height: 12),
                      _buildFeaturedProducts(context)
                          .animate().fadeIn(delay: 500.ms),
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildBannerCarousel(BuildContext context) {
    return SizedBox(
      height: 160,
      child: PageView.builder(
        itemCount: controller.banners.length,
        itemBuilder: (context, index) {
          final banner = controller.banners[index];
          return Container(
            margin: const EdgeInsets.only(right: 4),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: AppColors.warmGradient,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  if (banner.image.isNotEmpty)
                    Image.network(
                      Helpers.buildImageUrl(banner.image),
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const SizedBox(),
                    ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter, end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black.withValues(alpha: 0.6)],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 16, left: 16,
                    child: Text(banner.title,
                      style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildActiveCampaign(BuildContext context) {
    final campaign = controller.campaigns.first;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: AppColors.goldGradient,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.campaign, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(campaign.title, style: const TextStyle(
                color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15)),
              Text(campaign.description, style: const TextStyle(
                color: Colors.white70, fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis),
            ],
          )),
          if (campaign.multiplier > 1)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text('${campaign.multiplier}x', style: const TextStyle(
                color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16)),
            ),
        ],
      ),
    );
  }

  Widget _buildBalanceCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(
          color: AppColors.primary.withValues(alpha: 0.3),
          blurRadius: 20, offset: const Offset(0, 8),
        )],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total Coins'.tr,
                style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.monetization_on, color: AppColors.coinGold, size: 16),
                    const SizedBox(width: 4),
                    Text(Helpers.formatCoins(controller.user.value?.coins ?? 0),
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '${controller.user.value?.coins ?? 0}',
            style: const TextStyle(color: Colors.white, fontSize: 40, fontWeight: FontWeight.w800, letterSpacing: -1),
          ),
          const SizedBox(height: 4),
          Text('coins earned'.tr,
            style: const TextStyle(color: Colors.white60, fontSize: 13)),
          const SizedBox(height: 20),
          // Scan button
          GestureDetector(
            onTap: () async {
              await Get.toNamed(AppRoutes.scanner);
              controller.refreshUser();
              if (Get.isRegistered<WalletController>()) {
                Get.find<WalletController>().loadData();
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.accent,
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.accent.withValues(alpha: 0.25),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.qr_code_scanner, color: AppColors.primaryDark, size: 20),
                  const SizedBox(width: 8),
                  Text('Scan Now'.tr, style: const TextStyle(
                    color: AppColors.primaryDark, fontWeight: FontWeight.w700, fontSize: 15)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    final actions = [
      {'icon': Icons.history, 'label': 'Scan History'.tr, 'route': AppRoutes.scanHistory},
      {'icon': Icons.support_agent, 'label': 'Support'.tr, 'route': AppRoutes.createTicket},
      {'icon': Icons.star_outline, 'label': 'Rewards'.tr, 'route': AppRoutes.rewards},
      {'icon': Icons.account_balance_wallet_outlined, 'label': 'Wallet'.tr, 'route': ''},
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: actions.asMap().entries.map((entry) {
        final a = entry.value;
        return GestureDetector(
          onTap: () {
            final route = a['route'] as String;
            if (route.isNotEmpty) {
              Get.toNamed(route);
            } else {
              // Wallet - switch to wallet tab
              final navCtrl = Get.find<nav.NavigationController>();
              navCtrl.changePage(1);
            }
          },
          child: Column(
            children: [
              Container(
                width: 56, height: 56,
                decoration: BoxDecoration(
                  color: Theme.of(context).brightness == Brightness.dark
                      ? AppColors.darkBorder.withValues(alpha: 0.5)
                      : AppColors.primary.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(a['icon'] as IconData,
                  color: Theme.of(context).brightness == Brightness.dark
                      ? AppColors.accent
                      : AppColors.primary,
                  size: 24),
              ),
              const SizedBox(height: 8),
              Text(a['label'] as String, style: Theme.of(context).textTheme.labelMedium),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title, VoidCallback onViewAll) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title.tr, style: Theme.of(context).textTheme.headlineSmall),
        TextButton(onPressed: onViewAll, child: Text('View All'.tr)),
      ],
    );
  }

  Widget _buildRecentScans(BuildContext context) {
    if (controller.recentScans.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Theme.of(context).dividerColor),
        ),
        child: Center(
          child: Column(
            children: [
              Icon(Icons.qr_code_2, size: 48, color: Theme.of(context).textTheme.bodySmall?.color),
              const SizedBox(height: 12),
              Text('No scans yet'.tr, style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).textTheme.bodySmall?.color)),
              const SizedBox(height: 4),
              Text('Scan your first ARFIX product!'.tr, style: const TextStyle(fontSize: 12)),
            ],
          ),
        ),
      );
    }

    return Column(
      children: controller.recentScans.map((scan) => Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Theme.of(context).dividerColor),
        ),
        child: Row(
          children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(
                color: AppColors.success.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.check_circle, color: AppColors.success, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(scan.productName ?? scan.couponCode, style: Theme.of(context).textTheme.titleSmall),
                  Text(Helpers.timeAgo(scan.scannedAt ?? ''),
                    style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ),
            Text('+${scan.coinsEarned}',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: AppColors.success, fontWeight: FontWeight.w700)),
            const SizedBox(width: 4),
            const Icon(Icons.monetization_on, color: AppColors.coinGold, size: 16),
          ],
        ),
      )).toList(),
    );
  }

  Widget _buildFeaturedProducts(BuildContext context) {
    if (controller.products.isEmpty) {
      return SizedBox(height: 100, child: Center(child: Text('No products yet'.tr)));
    }

    return SizedBox(
      height: 200,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: controller.products.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final product = controller.products[index];
          return GestureDetector(
            onTap: () => Get.toNamed(AppRoutes.productDetail, arguments: product.id),
            child: Container(
              width: 160,
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Theme.of(context).dividerColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.05),
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                      ),
                      child: Center(
                        child: product.primaryImageUrl.isNotEmpty
                            ? ClipRRect(
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                child: Image.network(
                                  Helpers.buildImageUrl(product.primaryImageUrl),
                                  fit: BoxFit.contain, width: double.infinity,
                                  errorBuilder: (_, __, ___) => const Icon(Icons.inventory_2, size: 40, color: AppColors.primary),
                                ),
                              )
                            : const Icon(Icons.inventory_2, size: 40, color: AppColors.primary),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(product.name, maxLines: 1, overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.titleSmall),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.star, color: AppColors.coinGold, size: 14),
                            const SizedBox(width: 4),
                            Text('${product.averageRating}', style: Theme.of(context).textTheme.bodySmall),
                            Text(' (${product.totalReviews})', style: Theme.of(context).textTheme.bodySmall),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLoadingState() {
    return const Padding(
      padding: EdgeInsets.all(20),
      child: Column(
        children: [
          SizedBox(height: 60),
          SkeletonLoader(height: 24, width: 150),
          SizedBox(height: 8),
          SkeletonLoader(height: 30, width: 200),
          SizedBox(height: 24),
          SkeletonLoader(height: 180, borderRadius: 24),
          SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              SkeletonLoader(width: 56, height: 56, borderRadius: 16),
              SkeletonLoader(width: 56, height: 56, borderRadius: 16),
              SkeletonLoader(width: 56, height: 56, borderRadius: 16),
              SkeletonLoader(width: 56, height: 56, borderRadius: 16),
            ],
          ),
        ],
      ),
    );
  }
}
