import 'package:get/get.dart';
import 'controller.dart';

class RewardsBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => RewardsController());
  }
}
