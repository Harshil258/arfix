import '../models/product_model.dart';
import '../providers/product_provider.dart';

class ProductRepository {
  final ProductProvider _provider = ProductProvider();

  Future<({List<ProductModel> products, PaginationModel pagination})> getProducts({
    int page = 1, int limit = 20, String? search,
  }) async {
    final data = await _provider.getProducts(page: page, limit: limit, search: search);
    final responseData = data['data'] ?? data;
    final products = (responseData['products'] as List?)
        ?.map((e) => ProductModel.fromJson(e))
        .toList() ?? [];
    final pagination = PaginationModel.fromJson(responseData['pagination'] ?? {});
    return (products: products, pagination: pagination);
  }

  Future<ProductModel> getProduct(String id) async {
    final data = await _provider.getProduct(id);
    final responseData = data['data'] ?? data;
    return ProductModel.fromJson(responseData);
  }
}
