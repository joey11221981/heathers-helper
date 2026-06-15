import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vibration/vibration.dart';

import '../theme/app_theme.dart';

class TimerScreen extends StatefulWidget {
  const TimerScreen({super.key});

  @override
  State<TimerScreen> createState() => _TimerScreenState();
}

class _TimerScreenState extends State<TimerScreen> {
  static const _durationKey = 'last_duration_seconds';

  final List<int> _presets = const [60, 300, 600, 900, 1800];

  Timer? _ticker;
  int _totalSeconds = 300;
  int _remainingSeconds = 300;
  bool _isRunning = false;
  bool _isFinished = false;

  @override
  void initState() {
    super.initState();
    _loadLastDuration();
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  Future<void> _loadLastDuration() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getInt(_durationKey);
    if (saved != null && saved > 0 && mounted) {
      setState(() {
        _totalSeconds = saved;
        _remainingSeconds = saved;
      });
    }
  }

  Future<void> _saveDuration(int seconds) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_durationKey, seconds);
  }

  double get _progress {
    if (_totalSeconds == 0) return 0;
    return _remainingSeconds / _totalSeconds;
  }

  String _formatDuration(int seconds) {
    final hours = seconds ~/ 3600;
    final minutes = (seconds % 3600) ~/ 60;
    final secs = seconds % 60;
    if (hours > 0) {
      return '${hours.toString().padLeft(2, '0')}:'
          '${minutes.toString().padLeft(2, '0')}:'
          '${secs.toString().padLeft(2, '0')}';
    }
    return '${minutes.toString().padLeft(2, '0')}:'
        '${secs.toString().padLeft(2, '0')}';
  }

  String _presetLabel(int seconds) {
    if (seconds < 60) return '${seconds}s';
    if (seconds % 60 == 0) return '${seconds ~/ 60} min';
    return _formatDuration(seconds);
  }

  void _setDuration(int seconds, {bool save = true}) {
    if (_isRunning) return;
    setState(() {
      _totalSeconds = seconds;
      _remainingSeconds = seconds;
      _isFinished = false;
    });
    if (save) {
      _saveDuration(seconds);
    }
  }

  void _start() {
    if (_remainingSeconds <= 0) {
      _setDuration(_totalSeconds, save: false);
    }
    _ticker?.cancel();
    setState(() {
      _isRunning = true;
      _isFinished = false;
    });
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
  }

  void _pause() {
    _ticker?.cancel();
    setState(() => _isRunning = false);
  }

  void _reset() {
    _ticker?.cancel();
    setState(() {
      _isRunning = false;
      _isFinished = false;
      _remainingSeconds = _totalSeconds;
    });
  }

  void _tick() {
    if (_remainingSeconds <= 1) {
      _ticker?.cancel();
      setState(() {
        _remainingSeconds = 0;
        _isRunning = false;
        _isFinished = true;
      });
      _onTimerComplete();
      return;
    }
    setState(() => _remainingSeconds--);
  }

  Future<void> _onTimerComplete() async {
    HapticFeedback.heavyImpact();
    final hasVibrator = await Vibration.hasVibrator();
    if (hasVibrator == true) {
      Vibration.vibrate(pattern: [0, 400, 200, 400, 200, 600]);
    }
    if (!mounted) return;
    await showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Time's up!"),
        content: const Text('Your timer has finished.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  Future<void> _showCustomPicker() async {
    if (_isRunning) return;

    int minutes = _totalSeconds ~/ 60;
    int seconds = _totalSeconds % 60;

    final result = await showModalBottomSheet<bool>(
      context: context,
      showDragHandle: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final total = (minutes * 60) + seconds;
            return Padding(
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Custom timer',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _SpinnerColumn(
                        label: 'Min',
                        value: minutes,
                        max: 180,
                        onChanged: (v) => setModalState(() => minutes = v),
                      ),
                      const SizedBox(width: 24),
                      _SpinnerColumn(
                        label: 'Sec',
                        value: seconds,
                        max: 59,
                        onChanged: (v) => setModalState(() => seconds = v),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _formatDuration(total),
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: AppTheme.teal,
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const SizedBox(height: 20),
                  FilledButton(
                    onPressed: total > 0
                        ? () => Navigator.of(context).pop(true)
                        : null,
                    child: const Text('Set timer'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );

    if (result == true) {
      final total = (minutes * 60) + seconds;
      if (total > 0) {
        _setDuration(total);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusText = _isFinished
        ? 'Complete'
        : _isRunning
            ? 'Running'
            : 'Ready';

    return Scaffold(
      appBar: AppBar(
        title: const Text("Heather's Helper"),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.asset(
                  'assets/app_icon.png',
                  height: 72,
                  width: 72,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Your local countdown timer',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 28),
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 260,
                        height: 260,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            SizedBox(
                              width: 260,
                              height: 260,
                              child: CircularProgressIndicator(
                                value: _progress,
                                strokeWidth: 10,
                                backgroundColor:
                                    AppTheme.teal.withValues(alpha: 0.12),
                                color: _isFinished
                                    ? AppTheme.geckoGreen
                                    : AppTheme.teal,
                              ),
                            ),
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  _formatDuration(_remainingSeconds),
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineLarge
                                      ?.copyWith(fontSize: 52),
                                ),
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: _isFinished
                                        ? AppTheme.geckoGreen
                                            .withValues(alpha: 0.15)
                                        : AppTheme.teal
                                            .withValues(alpha: 0.08),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    statusText,
                                    style: TextStyle(
                                      color: _isFinished
                                          ? AppTheme.geckoGreen
                                          : AppTheme.teal,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Text(
                'Quick presets',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontSize: 18,
                    ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                alignment: WrapAlignment.center,
                children: [
                  for (final preset in _presets)
                    ChoiceChip(
                      label: Text(_presetLabel(preset)),
                      selected: !_isRunning &&
                          _totalSeconds == preset &&
                          _remainingSeconds == preset,
                      onSelected: _isRunning
                          ? null
                          : (_) => _setDuration(preset),
                    ),
                  ActionChip(
                    label: const Text('Custom'),
                    onPressed: _isRunning ? null : _showCustomPicker,
                  ),
                ],
              ),
              const SizedBox(height: 28),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _isRunning ? null : _reset,
                      child: const Text('Reset'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: FilledButton.icon(
                      onPressed: _isRunning ? _pause : _start,
                      icon: Icon(_isRunning ? Icons.pause : Icons.play_arrow),
                      label: Text(_isRunning ? 'Pause' : 'Start'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

class _SpinnerColumn extends StatelessWidget {
  const _SpinnerColumn({
    required this.label,
    required this.value,
    required this.max,
    required this.onChanged,
  });

  final String label;
  final int value;
  final int max;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label, style: Theme.of(context).textTheme.bodyMedium),
        const SizedBox(height: 8),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              onPressed: value > 0 ? () => onChanged(value - 1) : null,
              icon: const Icon(Icons.remove_circle_outline),
            ),
            SizedBox(
              width: 48,
              child: Text(
                value.toString().padLeft(2, '0'),
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ),
            IconButton(
              onPressed: value < max ? () => onChanged(value + 1) : null,
              icon: const Icon(Icons.add_circle_outline),
            ),
          ],
        ),
      ],
    );
  }
}
