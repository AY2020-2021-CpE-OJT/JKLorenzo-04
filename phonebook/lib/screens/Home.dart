import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:phonebook/modules/Cache.dart';
import '../structures/PBData.dart';

Stream<List<PBData>> contacts() async* {
  yield* Stream.periodic(Duration(seconds: 1), (int req) async {
    return await Cache.getContacts(req % 60 == 1);
  }).asyncMap((event) async => await event);
}

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  bool _isEditting = false;
  List<String> _selected = [];

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      initialData: <PBData>[],
      stream: contacts(),
      builder: (context, AsyncSnapshot<List<PBData>> snapshot) {
        return Scaffold(
          backgroundColor: Colors.grey[900],
          appBar: AppBar(
            backgroundColor: Colors.grey[850],
            title: Text('Contacts'),
            centerTitle: true,
            actions: [
              TextButton(
                child: Text(_isEditting ? 'Cancel' : 'Edit'),
                onPressed: () {
                  setState(() {
                    if (_isEditting) {
                      _isEditting = false;
                    } else {
                      _selected = [];
                      _isEditting = true;
                    }
                  });
                },
              )
            ],
          ),
          body: Center(
            child: ListView.builder(
              itemCount: snapshot.data?.length ?? 0,
              itemBuilder: (context, index) {
                final this_data = snapshot.data![index];
                return ListTile(
                  horizontalTitleGap: 5,
                  leading: Icon(
                    Icons.person,
                    color: Colors.white,
                    size: 50,
                  ),
                  title: Text(
                    '${this_data.first_name} ${this_data.last_name}',
                    style: TextStyle(
                        color: Colors.grey[200],
                        fontSize: 18,
                        letterSpacing: 1),
                  ),
                  subtitle: Text(
                    '${this_data.phone_numbers.take(3).join(', ')} ${this_data.phone_numbers.length > 3 ? '...' : ''}',
                    style: TextStyle(
                        color: Colors.grey[500],
                        fontSize: 12,
                        letterSpacing: 1),
                  ),
                  trailing: _isEditting
                      ? Icon(
                          _selected.contains(this_data.id)
                              ? Icons.radio_button_checked
                              : Icons.radio_button_unchecked,
                          color: Colors.lightBlue)
                      : null,
                  onTap: () {
                    if (_isEditting) {
                      setState(() {
                        if (_selected.contains(this_data.id)) {
                          _selected.remove(this_data.id);
                        } else {
                          _selected.add(this_data.id);
                        }
                      });
                    } else {
                      Fluttertoast.showToast(
                          msg: this_data.id,
                          toastLength: Toast.LENGTH_SHORT,
                          gravity: ToastGravity.BOTTOM,
                          fontSize: 16.0);
                    }
                  },
                );
              },
            ),
          ),
          floatingActionButton: _isEditting
              ? FloatingActionButton.extended(
                  backgroundColor: Colors.red,
                  icon: Icon(Icons.delete),
                  label: Text('Delete',
                      style: TextStyle(
                          color: Colors.white, fontSize: 12, letterSpacing: 1)),
                  onPressed: () async {
                    setState(() {
                      _isEditting = false;
                    });
                    await Cache.deleteContacts(_selected);
                  },
                )
              : FloatingActionButton(
                  child: Icon(Icons.add),
                  onPressed: () {},
                ),
          floatingActionButtonLocation: _isEditting
              ? FloatingActionButtonLocation.centerFloat
              : FloatingActionButtonLocation.endFloat,
        );
      },
    );
  }
}
