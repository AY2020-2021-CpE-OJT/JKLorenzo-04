import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:phonebook/modules/API.dart';
import 'package:phonebook/structures/PBData.dart';
import 'package:phonebook/utils/Toasts.dart';

class Manage extends StatefulWidget {
  final String id;
  const Manage({Key? key, required String this.id}) : super(key: key);

  @override
  _ManageState createState() => _ManageState(id);
}

class _ManageState extends State<Manage> {
  bool _initialized = false;
  String _id;
  int PNumTextFields_id = 0;

  TextEditingController fname_ctrlr = TextEditingController();
  TextEditingController lname_ctrlr = TextEditingController();
  List<PNumTextField> PNumTextFields = [];

  _ManageState(String this._id);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: API.getContact(_id),
      builder: (context, AsyncSnapshot<PBData> snapshot) {
        if (!snapshot.hasData) {
          return Center(
            child: CircularProgressIndicator(),
          );
        }

        // Apply data if exists
        if (!_initialized) {
          fname_ctrlr.text = snapshot.data!.first_name;
          lname_ctrlr.text = snapshot.data!.last_name;
          for (int i = 0; i < snapshot.data!.phone_numbers.length; i++) {
            PNumTextFields.add(PNumTextField(
              id: PNumTextFields_id++,
              initial: snapshot.data!.phone_numbers[i],
              remove: (id) {
                setState(() {
                  PNumTextFields.removeWhere((e) => e.id == id);
                });
              },
            ));
          }
          _initialized = true;
        }

        return Scaffold(
          backgroundColor: Colors.grey[900],
          appBar: AppBar(
            backgroundColor: Colors.grey[850],
            title: Text('Manage Contact'),
            centerTitle: true,
            actions: [
              TextButton(
                child: Text('Save'),
                onPressed: () async {
                  List<String> conditions = [];
                  if (fname_ctrlr.text.isEmpty) {
                    conditions.add('First Name must not be empty.');
                  }
                  if (lname_ctrlr.text.isEmpty) {
                    conditions.add('Last Name must not be empty.');
                  }
                  if (PNumTextFields.where((e) => e.controller.text.isEmpty)
                          .length >
                      0) {
                    conditions.add('Phone Numbers must not be empty.');
                  }

                  if (conditions.isNotEmpty) {
                    Toasts.showMessage(conditions.join(',\n'));
                  } else {
                    await API.patchContact(
                      PBData(
                        _id,
                        fname_ctrlr.text,
                        lname_ctrlr.text,
                        PNumTextFields.map((e) => e.controller.text).toList(),
                      ),
                    );
                    Toasts.showMessage('Saved');
                    Navigator.of(context).pop();
                  }
                },
              ),
            ],
          ),
          body: Center(
            child: ListView(
              children: [
                SizedBox(height: 50),
                CircleAvatar(
                  child: Icon(Icons.person, size: 80),
                  radius: 50,
                ),
                Padding(
                  padding: EdgeInsets.fromLTRB(40, 30, 40, 0),
                  child: Column(
                    children: [
                      TextField(
                        controller: fname_ctrlr,
                        decoration: InputDecoration(
                          prefixIcon: Icon(Icons.person),
                          hintText: 'First Name',
                          labelText: 'First Name',
                        ),
                      ),
                      TextField(
                        controller: lname_ctrlr,
                        decoration: InputDecoration(
                          prefixIcon: Icon(Icons.person),
                          hintText: 'Last Name',
                          labelText: 'Last Name',
                        ),
                      ),
                      SizedBox(height: 20),
                      ...PNumTextFields,
                      SizedBox(height: 20),
                      TextButton(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [Icon(Icons.add), Text('Add Phone Number')],
                        ),
                        onPressed: () {
                          setState(() {
                            PNumTextFields.add(PNumTextField(
                              id: PNumTextFields_id++,
                              remove: (id) {
                                setState(() {
                                  PNumTextFields.removeWhere((e) => e.id == id);
                                });
                              },
                            ));
                          });
                        },
                      ),
                      SizedBox(height: 20),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class PNumTextField extends StatelessWidget {
  final id, remove, initial;
  final controller = TextEditingController();

  PNumTextField({
    Key? key,
    required int this.id,
    required this.remove,
    this.initial,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (initial != null) {
      controller.text = initial;
    }
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        prefixIcon: Icon(Icons.call),
        hintText: 'Phone Number',
        labelText: 'Phone Number',
        suffixIcon: IconButton(
          icon: Icon(Icons.remove, color: Colors.red),
          onPressed: () {
            this.remove(id);
          },
        ),
      ),
    );
  }
}
