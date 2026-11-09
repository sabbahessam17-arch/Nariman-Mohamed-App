import 'package:flutter/material.dart';

class FlashCardModel {
  final String id;
  final String emoji;
  final String title;
  final String description;
  final String practicalTip;

  const FlashCardModel({
    required this.id,
    required this.emoji,
    required this.title,
    required this.description,
    this.practicalTip = '',
  });
}

class ActivityItemModel {
  final String id;
  final String text;
  final int targetZoneIndex;

  const ActivityItemModel({
    required this.id,
    required this.text,
    required this.targetZoneIndex,
  });
}

class ActivityZoneModel {
  final String id;
  final String title;
  final String icon;

  const ActivityZoneModel({
    required this.id,
    required this.title,
    required this.icon,
  });
}

enum ActivityType { classification, ordering }

class StationActivityModel {
  final ActivityType type;
  final String question;
  final List<ActivityZoneModel> zones;
  final List<ActivityItemModel> items;
  final List<String> order;

  const StationActivityModel({
    required this.type,
    required this.question,
    this.zones = const [],
    this.items = const [],
    this.order = const [],
  });
}

class StationThemeColors {
  final Color primary;
  final Color dark;
  final Color light;
  final Color border;

  const StationThemeColors({
    required this.primary,
    required this.dark,
    required this.light,
    required this.border,
  });
}

class StationModel {
  final int id;
  final String name;
  final String tag;
  final String icon;
  final String goal;
  final StationThemeColors theme;
  final List<FlashCardModel> cards;
  final StationActivityModel activity;

  const StationModel({
    required this.id,
    required this.name,
    required this.tag,
    required this.icon,
    required this.goal,
    required this.theme,
    required this.cards,
    required this.activity,
  });
}
