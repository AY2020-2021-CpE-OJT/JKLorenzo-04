import 'dart:convert';
import 'package:http/http.dart';
import '../structures/PBData.dart';

const _authority = 'jklorenzo-pb-api.herokuapp.com';
const Map<String, String> _headers = {
  "Content-Type": "application/json",
};

class API {
  static upsert(PBData data) async {
    final _uri = Uri.https(_authority, '/api/contacts');
    await post(_uri, body: jsonEncode(data.toJSON()), headers: _headers);
  }

  static Future<List<PBData>> fetch() async {
    final _uri = Uri.https(_authority, '/api/contacts');
    Response response = await get(_uri, headers: _headers);
    if (response.statusCode != 200) return [];
    List<dynamic> body = jsonDecode(response.body);
    List<PBData> data = body.map((data) => PBData.fromJson(data)).toList();
    return data;
  }
}
