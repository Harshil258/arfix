import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/network/api_exceptions.dart';
import '../../data/models/product_model.dart';
import '../../data/repositories/product_repository.dart';

class ProductController extends GetxController {
  final _repo = ProductRepository();

  final products = <ProductModel>[].obs;
  final isLoading = true.obs;
  final isLoadingMore = false.obs;
  final isError = false.obs;
  final errorMessage = ''.obs;
  final searchController = TextEditingController();

  final showCloseButton = false.obs;
  final searchQuery = ''.obs;

  int _currentPage = 1;
  bool _hasMore = true;

  // Detail
  final selectedProduct = Rxn<ProductModel>();
  final isLoadingDetail = false.obs;

  @override
  void onInit() {
    super.onInit();
    loadProducts();

    // Listen to changes to toggle close button and update search query
    searchController.addListener(() {
      searchQuery.value = searchController.text;
      showCloseButton.value = searchController.text.isNotEmpty;
    });

    // Automatically trigger search after 500ms of no typing
    debounce(searchQuery, (query) {
      loadProducts(refresh: true);
    }, time: const Duration(milliseconds: 500));
  }

  Future<void> loadProducts({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _hasMore = true;
      products.clear();
    }
    isLoading.value = products.isEmpty;
    isError.value = false;

    try {
      final result = await _repo.getProducts(
        page: _currentPage,
        search: searchController.text.isNotEmpty ? searchController.text : null,
      );
      products.addAll(result.products);
      _hasMore = result.pagination.hasMore;
      _currentPage++;
    } on ApiException catch (e) {
      if (products.isEmpty) {
        isError.value = true;
        errorMessage.value = e.message;
      }
    } catch (e) {
      if (products.isEmpty) {
        isError.value = true;
        errorMessage.value = 'Something went wrong';
      }
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> loadMore() async {
    if (isLoadingMore.value || !_hasMore) return;
    isLoadingMore.value = true;
    await loadProducts();
    isLoadingMore.value = false;
  }

  Future<void> searchProducts(String query) async {
    await loadProducts(refresh: true);
  }

  Future<void> loadProductDetail(String id) async {
    isLoadingDetail.value = true;
    try {
      selectedProduct.value = await _repo.getProduct(id);
    } catch (e) {
      selectedProduct.value = null;
    }
    isLoadingDetail.value = false;
  }

  @override
  void onClose() {
    searchController.dispose();
    super.onClose();
  }
}
