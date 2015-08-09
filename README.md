# Server

## API Reference
There are three supported methods:

### set_state:
set\_state: sets the state of a user in the database

**Expects:**

* name: of the sender (unique string to identify sender)
* battery_level: of the senders phone (float 0.0 - 1.0)
* lat: latitude of the sender
* lon: longitude of the sender

**Example:** (need to change localhost to actual server but can't remember)

http://agnok.com/set_state?name=Brennan&lat=90&lon=94&battery_level=.50

### get_state:
set\_state: retrieves the state of a user in the database

**Expects:**

* name: of the sender (unique string to identify sender)

**Example:** (need to change localhost to actual server but can't remember)

http://agnok.com/get_state?name=Brennan

### delete_state:
delete\_state: deletes the state of a user in the database

* name: of the sender (unique string to identify sender)

**Example:** (need to change localhost to actual server but can't remember)

http://agnok.com/delete_state?name=Brennan

