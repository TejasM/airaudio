if (Meteor.isClient) {
    Template.registerHelper("prettifyDate", function (timestamp) {
        return moment(new Date(timestamp)).fromNow();
    });

    Template.registerHelper("diffDuration", function (t2, t1) {
        return (t2 - t1);
    });

    Template.registerHelper("getHumanDate", function (time) {
        return msToTime(time);
    });

    Template.registerHelper("timeNow", function (time) {
        return Session.get('time');
    });

    Template.registerHelper("tagBegin", function (time) {
        return time - 30000;
    });

    Template.registerHelper("tagEnd", function (time) {
        return time + 30000;
    });

    Template.registerHelper("getTagWidth", function (_class) {
        return 60000 * 100 / (_class.end_time - _class.start_time);
    });

    Template.registerHelper("divide", function (num, num_2) {
        return num/num_2;
    });

    Template.registerHelper("getPreTagWidth", function (t2, t1, _class) {
        return (t2 - t1) * 100 / (_class.end_time - _class.start_time);
    });

    function msToTime(duration) {
        var seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        if (hours == "00") {
            return minutes + ":" + seconds;
        }
        return hours + ":" + minutes + ":" + seconds;
    }

    Meteor.startup(function () {
        setInterval(function () {
            Session.set("time", new Date());
        }, 1000);
    });
}

if (Meteor.isServer) {
    Meteor.publish("courses", function () {
        return Courses.find({});
    });
    Meteor.publish("classes", function () {
        return Classes.find({});
    });
    Meteor.publish("enrollments", function () {
        return Enrollments.find({});
    });
    Meteor.publish("tags", function () {
        return Tags.find({});
    });

    Audios.allow({
        'insert': function () {
            if (Meteor.user()) {
                return true;
            }
        }
    });


    Meteor.startup(function () {

        if (Accounts.users.find().count() === 0) {
            var user = Accounts.createUser({
                username: 'tejasmehta0@gmail.com',
                password: 'tejas',
                email: 'tejasmehta0@gmail.com',
            });
            var course = Courses.insert({
                'title': 'BMF 100',
                'password': 'password',
            });
            Enrollments.insert({
                course_id: course,
                user_id: user
            });
            var _class = Classes.insert({
                course_id: course,
                start_time: new Date() - 60000,
                end_time: new Date(),
                title: "Sample Title",
                live: false,
                audio_path: '/media/try.mp3',
            });
            var _class2 = Classes.insert({
                course_id: course,
                start_time: new Date() - 600000,
                title: "Sample Title Live",
                live: true
            });
            Attendances.insert({
                user_id: user,
                'class_id': _class
            });
            Attendances.insert({
                user_id: user._id,
                'class_id': _class2
            });
            Tags.insert({
                'user': user._id,
                'class_id': _class,
                'text': 'Important',
                'create_time': new Date() - 30000
            });
        }
    });
}
