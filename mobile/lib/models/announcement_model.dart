class Announcement {
  final String id;
  final String title;
  final String description;
  final String? imageUrl;
  final String type;
  final DateTime? eventDate;
  final bool isClosed;
  final int participationCount;

  Announcement({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    required this.type,
    this.eventDate,
    required this.isClosed,
    this.participationCount = 0,
  });

  factory Announcement.fromJson(Map<String, dynamic> json) {
    return Announcement(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      imageUrl: json['imageUrl'],
      type: json['type'],
      eventDate: json['eventDate'] != null
          ? DateTime.parse(json['eventDate'])
          : null,
      isClosed: json['isClosed'] ?? false,
      participationCount: json['_count']?['participations'] ?? 0,
    );
  }
}
