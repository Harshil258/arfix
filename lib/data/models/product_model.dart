class ProductImage {
  final String url;
  final String? publicId;

  ProductImage({required this.url, this.publicId});

  factory ProductImage.fromJson(Map<String, dynamic> json) {
    return ProductImage(url: json['url'] ?? '', publicId: json['publicId']);
  }
}

class ProductModel {
  final String id;
  final String name;
  final String description;
  final List<ProductImage> images;
  final double averageRating;
  final int totalReviews;
  final bool isActive;
  final String? createdAt;

  ProductModel({
    required this.id,
    required this.name,
    required this.description,
    required this.images,
    this.averageRating = 0.0,
    this.totalReviews = 0,
    this.isActive = true,
    this.createdAt,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      images: json['images'] != null
          ? (json['images'] as List).map((e) => ProductImage.fromJson(e)).toList()
          : [],
      averageRating: ((json['review'] ?? json['averageRating']) ?? 0).toDouble(),
      totalReviews: json['totalReviews'] ?? 0,
      isActive: json['isActive'] ?? true,
      createdAt: json['createdAt'],
    );
  }

  String get primaryImageUrl =>
      images.isNotEmpty ? images.first.url : '';
}

class PaginationModel {
  final int page;
  final int limit;
  final int total;
  final int pages;

  PaginationModel({
    required this.page, required this.limit,
    required this.total, required this.pages,
  });

  factory PaginationModel.fromJson(Map<String, dynamic> json) {
    return PaginationModel(
      page: json['page'] ?? 1, limit: json['limit'] ?? 10,
      total: json['total'] ?? 0, pages: json['pages'] ?? 1,
    );
  }

  bool get hasMore => page < pages;
}
