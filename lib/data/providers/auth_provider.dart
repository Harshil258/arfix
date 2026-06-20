import 'package:get/get.dart' hide Response;
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';

class AuthProvider {
  final ApiClient _apiClient = Get.find<ApiClient>();

  String _formatMobile(String number) {
    final clean = number.trim();
    if (clean.startsWith('+')) {
      return clean;
    }
    if (clean.startsWith('91') && clean.length == 12) {
      return '+$clean';
    }
    return '+91$clean';
  }

  Future<Map<String, dynamic>> signup({
    required String name,
    required String email,
    required String mobile,
    required String password,
    required String confirmPassword,
  }) async {
    final response = await _apiClient.post(ApiConstants.signup, data: {
      'name': name,
      'email': email,
      'mobile': _formatMobile(mobile),
      'password': password,
      'confirmPassword': confirmPassword,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> login({
    required String email, required String password,
  }) async {
    final response = await _apiClient.post(ApiConstants.login, data: {
      'email': email, 'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getMe() async {
    final response = await _apiClient.get(ApiConstants.me);
    return response.data;
  }

  Future<Map<String, dynamic>> updateProfile({
    required String name,
    String? mobile,
  }) async {
    final Map<String, dynamic> data = {'name': name};
    if (mobile != null && mobile.isNotEmpty) {
      data['mobile'] = _formatMobile(mobile);
    }
    final response = await _apiClient.patch(ApiConstants.me, data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> changePassword({
    required String currentPassword,
    required String newPassword,
    required String confirmNewPassword,
  }) async {
    final response = await _apiClient.patch(ApiConstants.changePassword, data: {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
      'confirmNewPassword': confirmNewPassword,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> forgotPassword({required String email}) async {
    final response = await _apiClient.post(ApiConstants.forgotPassword, data: {'email': email});
    return response.data;
  }

  Future<Map<String, dynamic>> verifyOtp({
    required String email,
    required String otp,
  }) async {
    final response = await _apiClient.post(ApiConstants.verifyOtp, data: {
      'email': email,
      'otp': otp,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> deleteAccount({required String password}) async {
    final response = await _apiClient.delete(ApiConstants.deleteAccount, data: {'password': password});
    return response.data;
  }

  Future<Map<String, dynamic>> resetPassword({
    required String token,
    required String newPassword,
    required String confirmNewPassword,
  }) async {
    final response = await _apiClient.post(ApiConstants.resetPassword, data: {
      'token': token,
      'newPassword': newPassword,
      'confirmNewPassword': confirmNewPassword,
    });
    return response.data;
  }
}
