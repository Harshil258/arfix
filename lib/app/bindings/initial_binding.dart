import 'package:get/get.dart';
import '../../core/network/api_client.dart';
import '../../core/storage/storage_service.dart';

class InitialBinding extends Bindings {
  @override
  void dependencies() {
    Get.put(StorageService(), permanent: true);
    Get.put(ApiClient(), permanent: true);
  }
}
