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
        ObjectMapper mapper = new ObjectMapper();

        var connection = DriverManager.getConnection("jdbc:sqlite:monadic.db");
        var statement = connection.createStatement();
        statement.execute("CREATE TABLE IF NOT EXISTS courses (identifier INTEGER PRIMARY KEY AUTOINCREMENT, lessons VARCHAR)");
        statement.close();

        Javalin app = Javalin.create(config -> { config.addStaticFiles("/public"); });
        app.get("/courses", ctx -> {
            var getStatement = connection.createStatement();
            var result = getStatement.executeQuery("SELECT identifier, lessons FROM courses");
            var courses = new ArrayList<Course>();
            while (result.next()) {
                // get the JSON representation first, then convert to an ArrayList<Lesson>
                String rs = result.getString("lessons");
                // this looks fucking disgusting but Jackson documentation says to do this so ¯\_(ツ)_/¯
                ArrayList<Lesson> lessons = mapper.readValue(rs, new TypeReference<ArrayList<Lesson>>() { } );
                courses.add(new Course(result.getInt("identifier"), lessons));
            }
            result.close();
            getStatement.close();
            ctx.json(courses);
        });

        app.post("/courses", ctx -> {
            // put empty lesson list into the course. we will use update() to add lessons later.
            ArrayList<Lesson> lessons = new ArrayList<>();
            String JSONLessons = mapper.writeValueAsString(lessons);
            var createStatement = connection.createStatement();
            createStatement.execute("INSERT INTO courses (lessons) VALUES" + JSONLessons);
        });
        app.start(7000);
    }
}
