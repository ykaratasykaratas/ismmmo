import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../services/announcement_service.dart';
import '../../models/announcement_model.dart';
import '../../core/theme/colors.dart';
import '../../core/constants/api_constants.dart';
import 'package:intl/intl.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final AnnouncementService _service = AnnouncementService();
  late Future<List<Announcement>> _announcementsFuture;

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  void _refresh() {
    setState(() {
      _announcementsFuture = _service.getAnnouncements();
    });
  }

  Future<void> _openMap(double lat, double lng) async {
    final googleMapsUrl = Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=$lat,$lng',
    );
    if (await canLaunchUrl(googleMapsUrl)) {
      await launchUrl(googleMapsUrl, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Harita uygulaması açılamadı')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Duyurular & Etkinlikler'),
        actions: [
          IconButton(
            icon: const Icon(
              Icons.notifications,
            ), // Placeholder or remove if not needed, user wants notification settings in menu later
            onPressed: () {
              // Navigation to notifications or just remove
            },
          ),
          IconButton(icon: const Icon(Icons.refresh), onPressed: _refresh),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      backgroundColor: Colors.grey[100],
      body: FutureBuilder<List<Announcement>>(
        future: _announcementsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Hata: ${snapshot.error}'));
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.feed_outlined, size: 60, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('Henüz yayınlanmış bir duyuru yok.'),
                ],
              ),
            );
          }

          final list = snapshot.data!;
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: list.length,
            separatorBuilder: (context, index) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final item = list[index];
              final isEvent = item.type == 'Event';

              return Card(
                elevation: 2,
                shadowColor: Colors.black12,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                clipBehavior: Clip.antiAlias,
                child: InkWell(
                  onTap: () {
                    // Detay sayfasına git
                  },
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header Strip
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border(
                            bottom: BorderSide(color: Colors.grey[100]!),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: isEvent
                                    ? AppColors.accent.withOpacity(0.1)
                                    : AppColors.primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                isEvent ? 'ETKİNLİK' : 'DUYURU',
                                style: TextStyle(
                                  color: isEvent
                                      ? AppColors.accent
                                      : AppColors.primary,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            if (item.eventDate != null)
                              Row(
                                children: [
                                  Icon(
                                    Icons.access_time,
                                    size: 14,
                                    color: Colors.grey[500],
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    DateFormat(
                                      'dd MMM yyyy, HH:mm',
                                      'tr',
                                    ).format(item.eventDate!),
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                          ],
                        ),
                      ),

                      // Image
                      if (item.imageUrl != null && item.imageUrl!.isNotEmpty)
                        SizedBox(
                          height: 200,
                          width: double.infinity,
                          child: Image.network(
                            '${ApiConstants.baseUrl}${item.imageUrl}',
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                color: Colors.grey[200],
                                child: const Center(
                                  child: Icon(
                                    Icons.broken_image,
                                    color: Colors.grey,
                                  ),
                                ),
                              );
                            },
                          ),
                        ),

                      // Content
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.title,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppColors.text,
                                height: 1.3,
                              ),
                            ),

                            if (item.locationName != null) ...[
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.location_on,
                                    size: 16,
                                    color: Colors.grey,
                                  ),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      item.locationName!,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],

                            const SizedBox(height: 12),
                            Text(
                              item.description,
                              maxLines: 4,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[700],
                                height: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Action Bar
                      if (isEvent)
                        // Action Bar
                        if (isEvent)
                          Builder(
                            builder: (context) {
                              final now = DateTime.now();
                              final isDeadlinePassed =
                                  item.participationDeadline != null &&
                                  now.isAfter(item.participationDeadline!);

                              // Basic check for visual feedback - exact quota check is on backend
                              // We can check if participationCount >= maxParticipants ONLY IF plusCount wasn't used much
                              // But for now let's rely on backend error for quota full

                              String buttonLabel = 'Katıl';
                              IconData buttonIcon = Icons.event_available;
                              bool isButtonDisabled = false;

                              if (isDeadlinePassed) {
                                buttonLabel = 'Süre Doldu';
                                buttonIcon = Icons.timer_off;
                                isButtonDisabled = true;
                              } else if (item.maxParticipants != null &&
                                  item.participationCount >=
                                      item.maxParticipants!) {
                                // Fallback: if even registrations exceed max, definitely full.
                                buttonLabel = 'Kontenjan Dolu';
                                buttonIcon = Icons.group_off;
                                isButtonDisabled = true;
                              }

                              return Padding(
                                padding: const EdgeInsets.fromLTRB(
                                  16,
                                  0,
                                  16,
                                  16,
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Info Row (Deadline & Quota)
                                    if (item.participationDeadline != null ||
                                        item.maxParticipants != null)
                                      Padding(
                                        padding: const EdgeInsets.only(
                                          bottom: 8.0,
                                        ),
                                        child: Wrap(
                                          spacing: 12,
                                          children: [
                                            if (item.participationDeadline !=
                                                null)
                                              Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  Icon(
                                                    Icons.hourglass_bottom,
                                                    size: 14,
                                                    color: isDeadlinePassed
                                                        ? Colors.red
                                                        : Colors.orange,
                                                  ),
                                                  const SizedBox(width: 4),
                                                  Text(
                                                    'Son: ${DateFormat('dd MMM HH:mm', 'tr').format(item.participationDeadline!)}',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: isDeadlinePassed
                                                          ? Colors.red
                                                          : Colors.grey[700],
                                                      fontWeight:
                                                          isDeadlinePassed
                                                          ? FontWeight.bold
                                                          : FontWeight.normal,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            if (item.maxParticipants != null)
                                              Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  const Icon(
                                                    Icons.people,
                                                    size: 14,
                                                    color: Colors.blue,
                                                  ),
                                                  const SizedBox(width: 4),
                                                  Text(
                                                    'Kota: ${item.maxParticipants} Kişi',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey[700],
                                                    ),
                                                  ),
                                                ],
                                              ),
                                          ],
                                        ),
                                      ),

                                    Row(
                                      children: [
                                        Expanded(
                                          child: ElevatedButton.icon(
                                            onPressed: isButtonDisabled
                                                ? null
                                                : () => _showJoinDialog(
                                                    context,
                                                    item,
                                                  ),
                                            icon: Icon(buttonIcon, size: 18),
                                            label: Text(buttonLabel),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: isButtonDisabled
                                                  ? Colors.grey
                                                  : AppColors.primary,
                                              foregroundColor: Colors.white,
                                              elevation: 0,
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                    vertical: 12,
                                                  ),
                                            ),
                                          ),
                                        ),
                                        if (item.latitude != null &&
                                            item.longitude != null) ...[
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: OutlinedButton.icon(
                                              onPressed: () => _openMap(
                                                item.latitude!,
                                                item.longitude!,
                                              ),
                                              icon: const Icon(
                                                Icons.map,
                                                size: 18,
                                              ),
                                              label: const Text('Harita'),
                                              style: OutlinedButton.styleFrom(
                                                foregroundColor:
                                                    AppColors.primary,
                                                side: const BorderSide(
                                                  color: AppColors.primary,
                                                ),
                                                padding:
                                                    const EdgeInsets.symmetric(
                                                      vertical: 12,
                                                    ),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _showJoinDialog(BuildContext context, Announcement item) {
    int plusCount = 0;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Etkinliğe Katıl'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('${item.title} etkinliğine katılmak istiyor musunuz?'),
              const SizedBox(height: 16),
              const Text('Yanınızda kaç kişi gelecek?'),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.remove_circle),
                    onPressed: plusCount > 0
                        ? () => setDialogState(() => plusCount--)
                        : null,
                  ),
                  Text(
                    plusCount.toString(),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.add_circle),
                    onPressed: plusCount < 5
                        ? () => setDialogState(() => plusCount++)
                        : null,
                  ),
                ],
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('İptal'),
            ),
            TextButton(
              onPressed: () async {
                Navigator.pop(ctx);
                try {
                  await _service.joinEvent(item.id, plusCount);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Katılımınız alındı!'),
                      backgroundColor: Colors.green,
                    ),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(e.toString()),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              child: const Text('Onayla'),
            ),
          ],
        ),
      ),
    );
  }
}
