package com.jhuoose.monadic;

import com.jhuoose.monadic.models.Lesson;
import io.javalin.Javalin;
import java.util.ArrayList;
import java.util.List;

public class Server {
    public static void main(String[] args) {
        var lessons = List.of(
                new Lesson(0.0, new ArrayList<>(), "Intro to Monads"),
                new Lesson(1.2, new ArrayList<>(), "Monad stuff"),
                new Lesson(1.3, new ArrayList<>(), "More monad stuff")
        );
        Javalin app = Javalin.create(config -> { config.addStaticFiles("/public"); });
        app.get("/lesson", ctx -> {
            ctx.json(lessons);
        });
        // we don't need to add new lessons over
        // the web...lessons only exist in the server
        // app.post("/lesson", ctx -> {
        //     lessons.add(new Lesson(1.4, new ArrayList<>(), "Monad nomads"));
        // });
        app.start(7000);
    }
}