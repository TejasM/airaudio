/**
 * Created by tejasmehta on 15-10-20.
 */
Courses = new Mongo.Collection("courses");
Classes = new Mongo.Collection("classes");
Enrollments = new Mongo.Collection("enrollments");
Attendances = new Mongo.Collection("attendances");
Audios = new FS.Collection("audios", {
    stores: [new FS.Store.FileSystem("audios", {path: "~/uploads"})]
});

Tags = new Mongo.Collection("tags");
