import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import './PBViewer.dart';
import '../helpers/DB.dart';
import '../structures/PBData.dart';

class PBManager extends StatelessWidget {
  const PBManager({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    TextEditingController _fname = TextEditingController();
    TextEditingController _lname = TextEditingController();
    TextEditingController _pnum = TextEditingController();
    return Scaffold(
        appBar: AppBar(
          title: const Text('Phonebook: Manage Contacts'),
          actions: [
            IconButton(
                icon: Icon(Icons.list),
                onPressed: () {
                  // Navigate to viewer
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => PBViewer()),
                  );
                }),
          ],
        ),
        body: Center(
            child: Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            children: [
              TextField(
                controller: _fname,
                decoration: InputDecoration(
                    border: UnderlineInputBorder(),
                    icon: Icon(Icons.person),
                    labelText: "First Name",
                    labelStyle: TextStyle(fontSize: 16),
                    hintText: "Juan"),
                keyboardType: TextInputType.name,
              ),
              Padding(
                  padding: const EdgeInsets.only(left: 40),
                  child: TextField(
                    controller: _lname,
                    decoration: InputDecoration(
                        border: UnderlineInputBorder(),
                        labelText: "Last Name",
                        labelStyle: TextStyle(fontSize: 16),
                        hintText: "De La Cruz"),
                    keyboardType: TextInputType.name,
                  )),
              TextField(
                controller: _pnum,
                decoration: InputDecoration(
                    border: UnderlineInputBorder(),
                    icon: Icon(Icons.phone),
                    labelText: "Phone Number",
                    labelStyle: TextStyle(fontSize: 16),
                    hintText: "444-44444"),
                maxLength: 9,
                maxLengthEnforcement: MaxLengthEnforcement.enforced,
                keyboardType: TextInputType.number,
              ),
              SizedBox(
                width: 300,
                height: 50,
                child: ElevatedButton(
                    onPressed: () async {
                      final fnameNotEmpty = _fname.text.length > 0;
                      final lnameNotEmpty = _lname.text.length > 0;
                      final pnumNotEmpty = _pnum.text.trim().length == 9;
                      if (fnameNotEmpty && lnameNotEmpty && pnumNotEmpty) {
                        final this_data = PBData(_fname.text.trim(),
                            _lname.text.trim(), [_pnum.text]);
                        String update_message = "Phone Number Added";
                        if (DB.contains(this_data)) {
                          update_message = "Phone Number Removed";
                        }
                        await DB.upsert(this_data);
                        Fluttertoast.showToast(
                            msg: update_message,
                            toastLength: Toast.LENGTH_SHORT,
                            gravity: ToastGravity.CENTER,
                            fontSize: 16.0);
                      } else {
                        Fluttertoast.showToast(
                            msg: "Invalid Input",
                            toastLength: Toast.LENGTH_SHORT,
                            gravity: ToastGravity.CENTER,
                            fontSize: 16.0);
                      }
                    },
                    child: const Text(
                      "Update Contact",
                      style: const TextStyle(fontSize: 18),
                    )),
              )
            ],
          ),
        )));
  }
}
