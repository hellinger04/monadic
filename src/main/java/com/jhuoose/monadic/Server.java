package com.jhuoose.monadic;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhuoose.monadic.models.Course;
import com.jhuoose.monadic.models.Lesson;
import com.jhuoose.monadic.models.LessonElement;
import io.javalin.Javalin;

import java.io.Reader;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Server {
    public static void main(String[] args) throws SQLException {
    //    var lessons = List.of(
    //            new Lesson(0.0, new ArrayList<>()),
    //            new Lesson(1.2, new ArrayList<>()),
    //            new Lesson(1.3, new ArrayList<>())
    //    );
        /* this is messy because List.of's are not mutable and
         * for some reason, it wasn't letting me put a List instead
         * of an ArrayList into an ArrayList of type Course
         * - it shouldn't matter - this will all be factored out later
         * when we connect to the DB
         */
        ObjectMapper mapper = new ObjectMapper();
        var morelessons = new ArrayList<Lesson>();
        var firstLesson = new Lesson(0, new ArrayList<>());
        var second = new Lesson(1 , new ArrayList<>());
        morelessons.add(firstLesson);
        morelessons.add(second);
        var firstCourse = new Course(0, morelessons);
        var secondCourse = new Course(1, morelessons);

        var connection = DriverManager.getConnection("jdbc:sqlite:monadic.db");
        var statement = connection.createStatement();
        statement.execute("CREATE TABLE IF NOT EXISTS courses (identifier INTEGER PRIMARY KEY AUTOINCREMENT, lessons VARCHAR)");
        statement.close();

        Javalin app = Javalin.create(config -> { config.addStaticFiles("/public"); });
        app.get("/courses", ctx -> {
            // ctx.json(courses);
            var courses = new ArrayList<Course>();
            var getStatement = connection.createStatement();
            var result = getStatement.executeQuery("SELECT (identifier, lessons) FROM courses");
            while (result.next()) {
                // get the JSON representation first, then convert to an ArrayList<Lesson>
                String rs = result.getString("lessons");
                // this looks fucking disgusting but Jackson documentation says to do this so ¯\_(ツ)_/¯
                ArrayList<Lesson> lessons = mapper.readValue(rs, new TypeReference<ArrayList<Lesson>>() { } );
                courses.add(new Course(result.getInt("identifier"), lessons));
            }
            result.close();
            getStatement.close();
        });
        // we don't need to add new lessons over
        // the web...lessons only exist in the server
        // app.post("/lesson", ctx -> {
        //     lessons.add(new Lesson(1.4, new ArrayList<>(), "Monad nomads"));
        // });
        app.start(7000);
    }
}
