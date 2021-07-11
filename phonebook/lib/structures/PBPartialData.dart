class PBPartialData {
  String? id;
  String? first_name;
  String? last_name;
  List<String>? phone_numbers;

  PBPartialData({this.id, this.first_name, this.last_name, this.phone_numbers});

  toJson() {
    return {
      "_id": this.id,
      "first_name": this.first_name,
      "last_name": this.last_name,
      "phone_numbers": this.phone_numbers
    };
  }
}
