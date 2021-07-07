import 'dart:convert';
import 'package:http/http.dart';
import '../structures/PBData.dart';

final uri = Uri.http('10.0.2.2:3000', '/api/contacts');
final Map<String, String> header = {
  "Content-Type": "application/json",
};

class API {
  static upsert(PBData data) async {
    await post(uri, body: jsonEncode(data.toJSON()), headers: header);
  }

  static Future<List<PBData>> fetch() async {
    Response response = await get(uri);
    if (response.statusCode != 200) return [];
    List<dynamic> body = jsonDecode(response.body);
    List<PBData> data = body.map((data) => PBData.fromJson(data)).toList();
    return data;
  }
}
