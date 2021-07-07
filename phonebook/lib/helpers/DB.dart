import '../structures/PBData.dart';
import '../managers/API.dart';

var _updated = true;
Map<String, PBData> _phonebook = Map();

class DB {
  static String _generateKey(PBData data) {
    return '${data.last_name.toLowerCase()}_${data.first_name.toLowerCase()}';
  }

  static PBData _update(PBData data) {
    return _phonebook.update(_generateKey(data), (value) {
      if (contains(data)) {
        value.phone_numbers.remove(data.phone_numbers.first);
      } else {
        value.phone_numbers.addAll(data.phone_numbers);
      }
      return value;
    }, ifAbsent: () {
      return data;
    });
  }

  static exists(PBData data) {
    final key = _generateKey(data);
    if (_phonebook.containsKey(key)) return true;
    return false;
  }

  static bool contains(PBData data) {
    if (!exists(data)) return false;
    final key = _generateKey(data);
    if (_phonebook[key]!.phone_numbers.contains(data.phone_numbers.first)) {
      return true;
    }
    return false;
  }

  static upsert(PBData data) async {
    final _exists = exists(data);
    final _this_data = _update(data);
    final _similar = _this_data.equals(data);
    if (!_exists || !_similar) {
      await API.upsert(_this_data);
      _updated = true;
    }
  }

  static Future<List<PBData>> fetchAll() async {
    if (_updated) {
      final new_data = await API.fetch();
      _phonebook = Map();
      new_data.forEach((data) => _update(data));
      _updated = false;
    }
    return [..._phonebook.values];
  }
}
