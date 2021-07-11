import 'dart:convert';
import 'package:http/http.dart';
import 'package:phonebook/structures/PBPartialData.dart';
import '../structures/PBData.dart';

const _authority = 'jklorenzo-pb-api.herokuapp.com';
const Map<String, String> _headers = {
  "Content-Type": "application/json",
};

class API {
  static Future<List<PBData>> getContacts() async {
    final _uri = Uri.https(_authority, '/api/contacts');

    final response = await get(_uri, headers: _headers);
    if (response.statusCode != 200) throw response.body;

    final response_body = jsonDecode(response.body) as List<dynamic>;
    return response_body.map((data) => PBData.fromJson(data)).toList();
  }

  static Future<int> deleteContacts(List<PBPartialData> data) async {
    final _uri = Uri.https(_authority, '/api/contacts');
    final request_body = jsonEncode(data.map((e) => e.toJson()).toList());

    final response = await delete(_uri, headers: _headers, body: request_body);
    if (response.statusCode != 200) throw response.body;

    return int.parse(response.body);
  }
}
