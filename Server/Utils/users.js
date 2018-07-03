class Users {

    constructor() {
        this.users = [];
    }


    getRoomsCount() {

        var roomsArray = [];
        this.users.forEach((item) => {

            if (roomsArray.indexOf(item.room) === -1) {
                roomsArray.push(item.room);
            }

        })

        var roomCount = roomsArray.length;
        if (roomCount)
            return roomCount;
        else
            return 0;

        //var roomArray = this.users.map((item) => {
        //    return item.room;
        //})

        //if (roomArray) {

        //    return roomArray.length;

        //}
        //else {
        //    return 0;
        //}

    }

    getUserCount() {

        if (this.users) {

            return this.users.length;

        }
        else {
            return 0;
        }
        
    }
    


    addUser(id, name, room) {

        var userItem = { id, name, room };

        if (this.users.length > 0) {

            var duplicateArray = this.users.filter((item) => {
                return (item.name == name && item.room == room)
            })

            if (duplicateArray.length > 0) {
                return false;
            }
            else {
                this.users.push(userItem);
                return userItem;
            }
        }

        else {
            this.users.push(userItem);
            return userItem;
        }
    }

    getUsers(room) {

        var UserArray = this.users.filter((item) => {
            return item.room == room;

        });


        var mappedUserArray = UserArray.map((item => {
            return item.name;
        }));

        return mappedUserArray;




    }

    getUserbyID(iD) {

        var user = this.users.filter((item) => {
            return item.id === iD;
        })
        return user[0];
    }

    removeUser(id) {

        var tempArray = this.users.filter((user) => {

            return user.id != id;

        });

        if (tempArray) {
            this.users = tempArray;
            
        }

    }

}

module.exports = { Users };

