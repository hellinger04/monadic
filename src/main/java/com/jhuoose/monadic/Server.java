package com.jhuoose.monadic;


import com.jhuoose.monadic.repositories.UsersRepository;
import io.javalin.Javalin;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Server {

    public static void main(String[] args) throws SQLException {
        Javalin j = Javalin.create(config -> { config.addStaticFiles("/public"); });
        Connection connection = DriverManager.getConnection("jdbc:sqlite:monadic.db");
        UsersRepository usersRepository = new UsersRepository(connection);
        j.events(event -> { event.serverStopped(() -> { connection.close(); }); });
        //server functionality goes here (get, put, delete, etc)
        j.start(System.getenv("PORT") == null ? 7000 : Integer.parseInt(System.getenv("PORT")));
    }

}
