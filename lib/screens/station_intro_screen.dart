import 'package:flutter/material.dart';
import '../data/stations_data.dart';
import '../models/station_model.dart';
import 'cards_screen.dart';

class StationIntroScreen extends StatelessWidget {
  final StationModel station;

  const StationIntroScreen({super.key, required this.station});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('المحطة ${station.id + 1} من ${kStationsData.length}'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Center(
                child: Container(
                  width: 140,
                  height: 140,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: station.theme.light,
                    border: Border.all(color: station.theme.primary, width: 6),
                    boxShadow: [
                      BoxShadow(
                        color: station.theme.dark,
                        offset: const Offset(0, 8),
                        blurRadius: 0,
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Text(station.icon, style: const TextStyle(fontSize: 68)),
                ),
              ),
              const SizedBox(height: 28),
              Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 5),
                  decoration: BoxDecoration(
                    color: station.theme.light,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    station.tag,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: station.theme.dark,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                station.name,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: station.theme.dark,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: station.theme.border, width: 2),
                ),
                child: Column(
                  children: [
                    Text(
                      '🎯 ${station.goal}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F2A47),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${station.cards.length} بطاقات + تحدّي سحب وإفلات',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF7B8FA8),
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CardsScreen(station: station),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: station.theme.primary,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 56),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('ابدأ التعلّم'),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward_rounded),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
