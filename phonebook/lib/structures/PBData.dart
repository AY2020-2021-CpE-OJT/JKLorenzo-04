class PBData {
  String first_name;
  String last_name;
  List<String> phone_numbers;

  PBData(this.first_name, this.last_name, this.phone_numbers);

  factory PBData.fromJson(Map<String, dynamic> json) {
    List<dynamic> raw_phone_numbers = json['phone_numbers'];
    List<String> phone_numbers = raw_phone_numbers
        .map((phone_number) => phone_number.toString())
        .toList();
    return PBData(
      json['first_name'] as String,
      json['last_name'] as String,
      phone_numbers,
    );
  }

  equals(PBData data) {
    if (this.first_name != data.first_name) return false;
    if (this.last_name != data.last_name) return false;
    if (this.phone_numbers.join('_') != data.phone_numbers.join('_'))
      return false;
    return true;
  }

  toJSON() {
    return {
      "first_name": this.first_name,
      "last_name": this.last_name,
      "phone_numbers": this.phone_numbers,
    };
  }
}
