import 'package:get/get.dart';
import 'controller.dart';
import '../home/controller.dart';
import '../wallet/controller.dart';
import '../products/controller.dart';
import '../profile/controller.dart';

class NavigationBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => NavigationController());
    Get.lazyPut(() => HomeController());
    Get.lazyPut(() => WalletController());
    Get.lazyPut(() => ProductController());
    Get.lazyPut(() => ProfileController());
  }
}
