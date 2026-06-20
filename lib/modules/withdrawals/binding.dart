import 'package:get/get.dart';
import 'controller.dart';

class WithdrawalBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => WithdrawalController());
  }
}
