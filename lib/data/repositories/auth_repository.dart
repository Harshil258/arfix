import '../models/user_model.dart';
import '../providers/auth_provider.dart';

class AuthRepository {
  final AuthProvider _provider = AuthProvider();

  Future<({UserModel user, String? devOtp})> signup({
    required String name,
    required String email,
    required String mobile,
    required String password,
    required String confirmPassword,
  }) async {
    final data = await _provider.signup(
      name: name,
      email: email,
      mobile: mobile,
      password: password,
      confirmPassword: confirmPassword,
    );
    final responseData = data['data'] ?? data;
    final String? devOtp = responseData['devOtp']?.toString();
    return (
      user: UserModel.fromJson(responseData['user']),
      devOtp: devOtp,
    );
  }

  Future<({UserModel user, String token})> login({
    required String email, required String password,
  }) async {
    final data = await _provider.login(email: email, password: password);
    final responseData = data['data'] ?? data;
    final String token = (responseData['accessToken'] ?? '').toString();
    return (
      user: UserModel.fromJson(responseData['user']),
      token: token,
    );
  }

  Future<UserModel> getMe() async {
    final data = await _provider.getMe();
    final responseData = data['data'] ?? data;
    return UserModel.fromJson(responseData);
  }

  Future<UserModel> updateProfile({required String name, String? mobile}) async {
    final data = await _provider.updateProfile(name: name, mobile: mobile);
    final responseData = data['data'] ?? data;
    return UserModel.fromJson(responseData);
  }

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
    required String confirmNewPassword,
  }) async {
    await _provider.changePassword(
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    );
  }

  Future<({String? devOtp})> forgotPassword({required String email}) async {
    final data = await _provider.forgotPassword(email: email);
    final responseData = data['data'] ?? data;
    final String? devOtp = responseData['devOtp']?.toString();
    return (
      devOtp: devOtp,
    );
  }

  Future<void> resetPassword({
    required String token,
    required String newPassword,
    required String confirmNewPassword,
  }) async {
    await _provider.resetPassword(
      token: token,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    );
  }

  Future<({UserModel? user, String? token, String? resetToken})> verifyOtp({
    required String email,
    required String otp,
  }) async {
    final data = await _provider.verifyOtp(email: email, otp: otp);
    final responseData = data['data'] ?? data;
    
    UserModel? user;
    if (responseData['user'] != null) {
      user = UserModel.fromJson(responseData['user']);
    }
    
    final String? token = responseData['accessToken']?.toString();
    final String? resetToken = responseData['resetToken']?.toString();
    
    return (
      user: user,
      token: token,
      resetToken: resetToken,
    );
  }

  Future<void> deleteAccount({required String password}) async {
    await _provider.deleteAccount(password: password);
  }
}
