class Announcement {
  final String id;
  final String title;
  final String description;
  final String? imageUrl;
  final String type;
  final DateTime? eventDate;
  final String? locationName;
  final double? latitude;
  final double? longitude;
  final bool isClosed;
  final int participationCount;
  final int? maxParticipants;
  final DateTime? participationDeadline;

  Announcement({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    required this.type,
    this.eventDate,
    this.locationName,
    this.latitude,
    this.longitude,
    required this.isClosed,
    this.participationCount = 0,
    this.maxParticipants,
    this.participationDeadline,
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
      locationName: json['locationName'],
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      isClosed: json['isClosed'] ?? false,
      participationCount: json['_count']?['participations'] ?? 0,
      maxParticipants: json['maxParticipants'],
      participationDeadline: json['participationDeadline'] != null
          ? DateTime.parse(json['participationDeadline'])
          : null,
    );
  }
}
