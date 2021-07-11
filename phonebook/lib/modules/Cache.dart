import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:phonebook/modules/API.dart';
import 'package:phonebook/structures/PBData.dart';
import 'package:phonebook/structures/PBPartialData.dart';

bool _updated = true;
Map<String, PBData> _phonebook = Map();

_update(PBData data) {
  _phonebook.update(data.id, (_) => data, ifAbsent: () => data);
}

_remove(PBPartialData data) {
  _phonebook.remove(data.id);
}

class Cache {
  static Future<List<PBData>> getContacts(bool? force) async {
    if (_updated || (force ?? false)) {
      try {
        List<PBData> new_data = await API.getContacts();
        _phonebook = Map();
        new_data.forEach((data) => _update(data));
        _updated = false;
      } catch (error) {
        Fluttertoast.showToast(
            textColor: Colors.red,
            msg: error.toString(),
            toastLength: Toast.LENGTH_LONG,
            gravity: ToastGravity.BOTTOM,
            fontSize: 16.0);
      }
    }
    return [..._phonebook.values];
  }

  static Future<void> deleteContacts(List<String> ids) async {
    try {
      final data = ids.map((this_id) => PBPartialData(id: this_id)).toList();
      data.forEach((element) {
        _remove(element);
      });
      final deleted_count = await API.deleteContacts(data);
      if (deleted_count > 0) _updated = true;
      Fluttertoast.showToast(
          msg: '$deleted_count contacts deleted',
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          fontSize: 16.0);
    } catch (error) {
      Fluttertoast.showToast(
          textColor: Colors.red,
          msg: error.toString(),
          toastLength: Toast.LENGTH_LONG,
          gravity: ToastGravity.BOTTOM,
          fontSize: 16.0);
    }
  }
}
