import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../core/storage/storage_service.dart';
import '../../data/models/user_model.dart';
import '../../data/models/product_model.dart';
import '../../data/models/banner_model.dart';
import '../../data/models/scan_history_model.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/product_repository.dart';
import '../../data/repositories/home_repository.dart';

class HomeController extends GetxController {
  final _authRepo = AuthRepository();
  final _productRepo = ProductRepository();
  final _homeRepo = HomeRepository();
  final _storage = Get.find<StorageService>();

  final user = Rxn<UserModel>();
  final products = <ProductModel>[].obs;
  final banners = <BannerModel>[].obs;
  final campaigns = <CampaignModel>[].obs;
  final recentScans = <ScanHistoryItemModel>[].obs;
  final isLoading = true.obs;
  final isError = false.obs;
  final errorMessage = ''.obs;

  @override
  void onInit() {
    super.onInit();
    loadData();
  }

  Future<void> loadData() async {
    isLoading.value = true;
    isError.value = false;
    try {
      // Load user from cache first
      final cachedUser = _storage.getUserData();
      if (cachedUser != null) {
        user.value = UserModel.fromJson(cachedUser);
      }

      // Fetch fresh user data
      final freshUser = await _authRepo.getMe();
      user.value = freshUser;
      await _storage.saveUserData(freshUser.toJson());

      // Load products
      final result = await _productRepo.getProducts(limit: 6);
      products.value = result.products;

      // Load banners (silently fail)
      try {
        banners.value = await _homeRepo.getBanners();
      } catch (_) {}

      // Load campaigns (silently fail)
      try {
        campaigns.value = await _homeRepo.getCampaigns();
      } catch (_) {}

      // Load recent scans from server (silently fail)
      try {
        final scanResult = await _homeRepo.getScanHistory(page: 1, limit: 3);
        recentScans.value = scanResult.scans;
      } catch (_) {}
    } on ApiException catch (e) {
      isError.value = true;
      errorMessage.value = e.message;
    } catch (e) {
      isError.value = true;
      errorMessage.value = 'Something went wrong';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> refreshUser() async {
    try {
      final freshUser = await _authRepo.getMe();
      user.value = freshUser;
      await _storage.saveUserData(freshUser.toJson());

      // Refresh recent scans
      try {
        final scanResult = await _homeRepo.getScanHistory(page: 1, limit: 3);
        recentScans.value = scanResult.scans;
      } catch (_) {}
    } catch (_) {}
  }
}
