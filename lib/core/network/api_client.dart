import 'package:dio/dio.dart';
import 'package:get/get.dart' hide Response;

import '../constants/api_constants.dart';
import '../storage/storage_service.dart';
import 'api_exceptions.dart';

class ApiClient extends GetxService {
  late final Dio _dio;
  late final StorageService _storageService;

  Dio get dio => _dio;

  @override
  void onInit() {
    super.onInit();
    _storageService = Get.find<StorageService>();
    _dio = Dio(BaseOptions(
      baseUrl: ApiConstants.apiBaseUrl,
      connectTimeout: const Duration(milliseconds: ApiConstants.connectTimeout),
      receiveTimeout: const Duration(milliseconds: ApiConstants.receiveTimeout),
      sendTimeout: const Duration(milliseconds: ApiConstants.sendTimeout),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storageService.getToken();
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        // Auto-logout on 401 Unauthorized
        if (error.response?.statusCode == 401) {
          await _storageService.clearAll();
          Get.offAllNamed('/login');
          return handler.reject(error);
        }
        return handler.next(error);
      },
    ));
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) async {
    try {
      return await _dio.get(path, queryParameters: queryParameters);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Response> post(String path, {dynamic data}) async {
    try {
      return await _dio.post(path, data: data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Response> patch(String path, {dynamic data}) async {
    try {
      return await _dio.patch(path, data: data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Response> put(String path, {dynamic data}) async {
    try {
      return await _dio.put(path, data: data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Response> delete(String path, {dynamic data}) async {
    try {
      return await _dio.delete(path, data: data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  ApiException _handleError(DioException error) {
    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.sendTimeout ||
        error.type == DioExceptionType.receiveTimeout) {
      return ApiException(message: 'Connection timeout. Please try again.', statusCode: 408);
    }
    if (error.type == DioExceptionType.connectionError) {
      return ApiException(message: 'No internet connection.', statusCode: 0);
    }
    if (error.type == DioExceptionType.badResponse) {
      final data = error.response?.data;
      String message = 'Something went wrong';
      if (data is Map<String, dynamic>) message = data['message'] ?? message;
      return ApiException(message: message, statusCode: error.response?.statusCode ?? 500);
    }
    return ApiException(message: 'Unexpected error occurred.', statusCode: 500);
  }
}
